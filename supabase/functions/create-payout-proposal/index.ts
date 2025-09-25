// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Parser } from "npm:expr-eval";

function cutNumberAfter2Digits(n: number): number {
  return parseFloat(Number(n).toFixed(2));
}

interface RecipientPaymentInfo {
  id: string;
  recipient_name: string;
  means_of_payment: "MPESA" | "BANK" | "CASH" | "CHEQUE";
  mpesa_number?: string;
  bank_account_number?: string;
  bank_routing_number?: string;
  bank_name?: string;
}

interface Employee {
  first_name: string;
  last_name: string;
  recipient_payment_info?: RecipientPaymentInfo[];
}

interface Department {
  name: string;
}

interface Contract {
  id: string;
  employee_id: string;
  department_id: string;
  job_title: string;
  base_salary: number;
  work_percentage: number;
  calculation_basis: "MONTHLY" | "HOURLY";
  employee: Employee;
  department: Department;
}

interface PayAdjustment {
  id: string;
  name: string;
  amount?: number;
  percentage?: number;
  formula?: string;
  is_credit: boolean;
  adjustment_type: "AMOUNT" | "GS_PERCENTAGE" | "FORMULA";
}

interface PayAdjustmentToEmployee {
  id: string;
  pay_adjustment_id: string;
  user_input?: number;
  pay_adjustment: PayAdjustment;
}

interface WorkedHours {
  contract_id: string;
  hours: number;
}

interface PayoutProposalItem {
  payout_proposal_id: string;
  employee_id: string;
  employee_name: string;
  department_id: string;
  department_name: string;
  contract_id: string;
  contract_job_title: string;
  contract_base_salary: string;
  contract_work_percentage: number;
  contract_calculation_basis: "MONTHLY" | "HOURLY";
  rpi_id: string;
  rpi_name: string;
  rpi_payment_means: "MPESA" | "BANK" | "CASH" | "CHEQUE";
  rpi_account: string | undefined;
  rpi_bank_routing?: string;
  rpi_bank_name?: string;
  benefits: { id: string; name: string; amount: number }[];
  deductions: { id: string; name: string; amount: number }[];
  hours_worked: number | null;
  gross_salary: number;
  net_salary: number;
  net_salary_last_month: number;
}

interface CalculatedPayAdjustment {
  id: string;
  name: string;
  amount: number;
}

interface PayoutProposals {
  id: string;
  status: "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "DENIED" | "PAID_OUT";
}

interface RequestBody {
  worked_hours?: {
    contract_id: string;
    hours: number;
  }[];
  include_contracts?: string[];
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, x-client-info",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const body = await req.json() as RequestBody;

    if (!body.include_contracts || body.include_contracts?.length === 0) {
      throw new Error("Missing include_contracts");
    }

    // 1️⃣ Create the payout proposal
    const { data: proposalData, error: proposalError } = await supabase
      .from("payout_proposals")
      .insert({ status: "DRAFT" })
      .select("id");

    if (proposalError) throw proposalError;
    const payoutProposalId = proposalData[0].id;

    // 2️⃣ Fetch employees with current contracts
    const { data: contractsWithRelations, error: employeeError } =
      await supabase
        .from("contracts")
        .select(`
        id,
        employee_id,
        department_id,
        job_title,
        base_salary,
        work_percentage,
        calculation_basis,
        employee:employees(
          first_name,
          last_name,
          recipient_payment_info(
            id,
            recipient_name,
            means_of_payment,
            mpesa_number,
            bank_account_number,
            bank_routing_number,
            bank_name
            )
        ),
        department:departments(name)
      `)
        .lte("start_date", new Date().toISOString())
        .or(`end_date.gte.${new Date().toISOString()},end_date.is.null`)
        .in("id", body.include_contracts);

    if (employeeError) throw employeeError;

    // 3️⃣ Map employees to payout items with benefits & deductions
    const payoutProposalItems: PayoutProposalItem[] = [];

    for (const contract of contractsWithRelations) {
      const c = contract as unknown as Contract;

      const recipient = c.employee.recipient_payment_info?.[0];
      if (!recipient) {
        throw new Error("Missing recipient for employee " + c.employee_id);
      }

      const recipient_payment_info_account =
        recipient.means_of_payment === "MPESA"
          ? recipient.mpesa_number
          : recipient.bank_account_number;

      // Fetch pay adjustments for this employee
      const { data: adjustments = [], error: adjustmentsError } = await supabase
        .from("pay_adjustments_to_employees")
        .select(`
          id,
          pay_adjustment_id,
          user_input,
          pay_adjustment:pay_adjustments(
            id, 
            name, 
            amount, 
            is_credit,
            adjustment_type,
            amount,
            percentage,
            formula
          )
        `)
        .eq("employee_id", c.employee_id)
        .lte("start_date", new Date().toISOString())
        .or(`end_date.gte.${new Date().toISOString()},end_date.is.null`);

      if (adjustmentsError) throw adjustmentsError;

      if (adjustments === null) {
        throw new Error("Missing adjustments for employee " + c.employee_id);
      }

      const contractsWorkedHours = body.worked_hours || [];
      const hours_worked = contractsWorkedHours.find((bodyContract) =>
        bodyContract.contract_id === c.id
      )?.hours || 0;
      const gross_salary = c.calculation_basis === "MONTHLY"
        ? c.base_salary * c.work_percentage / 100
        : c.base_salary * hours_worked;

      // Split into benefits and deductions
      const benefits: CalculatedPayAdjustment[] = [];
      const deductions: CalculatedPayAdjustment[] = [];

      let net_salary = gross_salary;

      const aParsed = adjustments as unknown as PayAdjustmentToEmployee[];
      for (const a of aParsed) {
        let finalAmount = 0;
        const { user_input } = a;
        const {
          adjustment_type,
          is_credit,
          amount,
          percentage,
          formula,
          id,
          name,
        } = a.pay_adjustment;

        if (adjustment_type === "AMOUNT") {
          finalAmount = user_input || amount || 0;
        }
        if (adjustment_type === "GS_PERCENTAGE") {
          finalAmount = gross_salary *
            (user_input || percentage || 0) / 100;
        }
        if (adjustment_type === "FORMULA") {
          const parser = new Parser();
          if (!formula) {
            throw new Error(
              `Missing formula for contract ${c.id} and pay_adjustment ${a.id}`,
            );
          }
          const expr = parser.parse(formula);
          finalAmount = expr.evaluate({
            "USER_INPUT": user_input || 0,
            "GROSS_SALARY": gross_salary,
          }) || -1;
        }

        if (is_credit) {
          benefits.push({
            id,
            name,
            amount: finalAmount,
          });
          net_salary = net_salary + finalAmount;
        } else {
          deductions.push({
            id,
            name,
            amount: finalAmount,
          });
          net_salary = net_salary - finalAmount;
        }
      }

      // Fetch last month's payout for this contract & employee
      const { data: lastMonthItem, error: lastMonthItemError } = await supabase
        .from("payout_proposal_items")
        .select("id")
        .eq("employee_id", c.employee_id)
        .eq("contract_id", c.id)
        .order("created_at", { ascending: false }) // newest first
        .limit(1);

      if (lastMonthItemError) {
        throw lastMonthItemError;
      }

      let net_salary_last_month = 0;

      if (lastMonthItem && lastMonthItem.length > 0) {
        const lastItemId = lastMonthItem[0].id;

        const { data: lastPayoutData, error: lastPayoutError } = await supabase
          .from("payouts")
          .select("amount")
          .eq("payout_proposal_item_id", lastItemId)
          .single(); // expecting one payout per item

        if (
          lastPayoutError && lastPayoutError.code !== "PGRST116"
        ) {
          throw lastPayoutError; // ignore not found
        }
        if (lastPayoutData) {
          net_salary_last_month = Number(lastPayoutData.amount);
        }
      }

      // Push the final payout item
      payoutProposalItems.push({
        payout_proposal_id: payoutProposalId,
        employee_id: c.employee_id,
        employee_name: `${c.employee.first_name} ${c.employee.last_name}`,
        department_id: c.department_id,
        department_name: c.department.name,
        contract_id: c.id,
        contract_job_title: c.job_title,
        contract_base_salary: Number(c.base_salary).toFixed(2),
        contract_work_percentage: c.work_percentage,
        contract_calculation_basis: c.calculation_basis,
        rpi_id: recipient.id,
        rpi_name: recipient.recipient_name,
        rpi_payment_means: recipient.means_of_payment,
        rpi_account: recipient_payment_info_account,
        rpi_bank_routing: recipient.bank_routing_number,
        rpi_bank_name: recipient.bank_name,
        benefits,
        deductions,
        hours_worked: c.calculation_basis === "MONTHLY" ? null : hours_worked,
        gross_salary: cutNumberAfter2Digits(gross_salary),
        net_salary: cutNumberAfter2Digits(net_salary),
        net_salary_last_month: cutNumberAfter2Digits(net_salary_last_month),
      });
    }

    const { error: insertProposalItemsError } = await supabase
      .from("payout_proposal_items")
      .insert(payoutProposalItems);

    if (insertProposalItemsError) {
      throw insertProposalItemsError;
    }

    const responseData = {
      message: "Successfully created new payout proposal",
      meta: {
        id: payoutProposalId,
      },
    };

    return new Response(
      JSON.stringify(responseData, null, 2),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      },
    );
  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : (err && typeof err === "object" && "message" in err)
      ? (err as any).message
      : String(err);

    console.error(err);

    return new Response(
      JSON.stringify({ message }, null, 2),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
