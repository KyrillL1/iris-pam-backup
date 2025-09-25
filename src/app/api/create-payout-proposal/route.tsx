// app/api/payout-proposal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Parser } from "expr-eval";
import { createSupabaseServerClient } from "@utils/supabase/server";
import { SalaryCalculator } from "@lib/salary-calculator";

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

// --- CORS Headers ---
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
    "Access-Control-Allow-Headers":
        "Content-Type, Authorization, apikey, x-client-info",
};

// --- API Route ---
export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as RequestBody;

        if (!body.include_contracts || body.include_contracts.length === 0) {
            return NextResponse.json({ message: "Missing include_contracts" }, {
                status: 400,
                headers: corsHeaders,
            });
        }

        const supabase = await createSupabaseServerClient();

        // 1️⃣ Create the payout proposal
        const { data: proposalData, error: proposalError } = await supabase
            .from("payout_proposals")
            .insert({ status: "DRAFT" })
            .select("id");

        if (proposalError) throw proposalError;
        const payoutProposalId = proposalData![0].id;

        // 2️⃣ Fetch contracts with employees
        const { data: contractsWithRelations, error: contractsError } =
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

        if (contractsError) throw contractsError;

        // 3️⃣ Map contracts to payout items
        const payoutProposalItems: PayoutProposalItem[] = [];

        for (const contract of contractsWithRelations!) {
            const c = contract as unknown as Contract;
            const recipient = c.employee.recipient_payment_info?.[0];
            if (!recipient) {
                throw new Error(
                    "Missing recipient for employee " + c.employee_id,
                );
            }

            const recipient_account = recipient.means_of_payment === "MPESA"
                ? recipient.mpesa_number
                : recipient.bank_account_number;

            // Fetch pay adjustments
            const { data: adjustments = [], error: adjustmentsError } =
                await supabase
                    .from("pay_adjustments_to_employees")
                    .select(`
                        id,
                        pay_adjustment_id,
                        user_input,
                        pay_adjustment:pay_adjustments(
                            id, name, amount, is_credit, adjustment_type, percentage, formula
                        )
                    `)
                    .eq("employee_id", c.employee_id)
                    .lte("start_date", new Date().toISOString())
                    .or(`end_date.gte.${
                        new Date().toISOString()
                    },end_date.is.null`);

            if (adjustmentsError) throw adjustmentsError;

            const hoursWorked = body.worked_hours?.find((h) =>
                h.contract_id === c.id
            )?.hours || 0;

            const salaryCalc = new SalaryCalculator({
                baseSalary: c.base_salary,
                calculationBasis: c.calculation_basis,
                workPercentage: c.work_percentage,
                workQuantity: c.calculation_basis === "HOURLY"
                    ? hoursWorked
                    : 30,
            });

            const benefits: CalculatedPayAdjustment[] = [];
            const deductions: CalculatedPayAdjustment[] = [];

            for (
                const a of adjustments as unknown as PayAdjustmentToEmployee[]
            ) {
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
                let finalAmount = 0;

                if (adjustment_type === "AMOUNT") {
                    finalAmount = user_input || amount || 0;
                } else if (adjustment_type === "GS_PERCENTAGE") {
                    finalAmount = salaryCalc.grossSalary *
                        ((user_input || percentage || 0) / 100);
                } else if (adjustment_type === "FORMULA") {
                    if (!formula) {
                        throw new Error(
                            `Missing formula for contract ${c.id} and adjustment ${a.id}`,
                        );
                    }
                    finalAmount = new Parser().parse(formula).evaluate({
                        USER_INPUT: user_input || 0,
                        GROSS_SALARY: salaryCalc.grossSalary,
                    }) || 0;
                }

                (is_credit ? benefits : deductions).push({
                    id,
                    name,
                    amount: finalAmount,
                });
            }

            salaryCalc.setPayAdjustments(benefits, deductions);

            // Last month's net salary
            const { data: lastMonthItem } = await supabase
                .from("payout_proposal_items")
                .select("id")
                .eq("employee_id", c.employee_id)
                .eq("contract_id", c.id)
                .order("created_at", { ascending: false })
                .limit(1);

            let net_salary_last_month = 0;
            if (lastMonthItem && lastMonthItem.length > 0) {
                const { data: lastPayout } = await supabase
                    .from("payouts")
                    .select("amount")
                    .eq("payout_proposal_item_id", lastMonthItem[0].id)
                    .single();
                if (lastPayout) {
                    net_salary_last_month = Number(lastPayout.amount);
                }
            }

            payoutProposalItems.push({
                payout_proposal_id: payoutProposalId,
                employee_id: c.employee_id,
                employee_name:
                    `${c.employee.first_name} ${c.employee.last_name}`,
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
                rpi_account: recipient_account,
                rpi_bank_routing: recipient.bank_routing_number,
                rpi_bank_name: recipient.bank_name,
                benefits,
                deductions,
                hours_worked: c.calculation_basis === "MONTHLY"
                    ? null
                    : hoursWorked,
                gross_salary: salaryCalc.grossSalary,
                net_salary: salaryCalc.netSalary,
                net_salary_last_month: parseFloat(
                    net_salary_last_month.toFixed(2),
                ),
            });
        }

        // Insert payout proposal items
        const { error: insertError } = await supabase
            .from("payout_proposal_items")
            .insert(payoutProposalItems);

        if (insertError) throw insertError;

        return NextResponse.json({
            message: "Successfully created new payout proposal",
            meta: { id: payoutProposalId },
        }, { headers: corsHeaders });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            message: err instanceof Error ? err.message : String(err),
        }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return new NextResponse("ok", { headers: corsHeaders });
}
