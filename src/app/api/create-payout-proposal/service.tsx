import { NextResponse } from "next/server";
import {
    CalculatedPayAdjustment,
    Contract,
    PayAdjustmentToEmployee,
    PayoutProposalItem,
    RequestBody,
    WorkedHours,
} from "./types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SalaryCalculator } from "@lib/salary-calculator";
import { Parser } from "expr-eval";

export function checkBodyValid(body: RequestBody): NextResponse | undefined {
    if (!body.include_contracts || body.include_contracts.length === 0) {
        return NextResponse.json({ message: "Missing include_contracts" }, {
            status: 400,
        });
    }
}

export async function createPayoutProposal(supabase: SupabaseClient) {
    // 1️⃣ Create the payout proposal
    const { data: proposalData, error: proposalError } = await supabase
        .from("payout_proposals")
        .insert({ status: "DRAFT" })
        .select("id");

    if (proposalError) throw proposalError;

    const payoutProposalId = proposalData![0].id;

    return payoutProposalId;
}

export async function fetchContractsWithRelations(
    supabase: SupabaseClient,
    includeContacts: string[],
) {
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
            .in("id", includeContacts);

    if (contractsError) throw contractsError;

    return contractsWithRelations;
}

async function fetchPayAdjustmentsForEmployee(
    supabase: SupabaseClient,
    employeeId: string,
) {
    const { data: adjustments = [], error: adjustmentsError } = await supabase
        .from("pay_adjustments_to_employees")
        .select(`
                    id,
                    pay_adjustment_id,
                    user_input,
                    pay_adjustment:pay_adjustments(
                        id, name, amount, is_credit, adjustment_type, percentage, formula
                    )
                `)
        .eq("employee_id", employeeId)
        .lte("start_date", new Date().toISOString())
        .or(`end_date.gte.${new Date().toISOString()},end_date.is.null`);

    if (adjustmentsError) throw adjustmentsError;

    return adjustments;
}

function calculatePayAdjustments(
    adjustments: PayAdjustmentToEmployee[],
    salaryCalc: SalaryCalculator,
) {
    const benefits: CalculatedPayAdjustment[] = [];
    const deductions: CalculatedPayAdjustment[] = [];

    for (
        const a of adjustments
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
                    `Missing formula for adjustment ${a.id}`,
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

    return {
        benefits,
        deductions,
    };
}

async function getLastMonthNetSalary(
    supabase: SupabaseClient,
    employeeId: string,
    contractId: string,
) {
    const { data: lastMonthItem } = await supabase
        .from("payout_proposal_items")
        .select("id")
        .eq("employee_id", employeeId)
        .eq("contract_id", contractId)
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

    return net_salary_last_month;
}

export async function mapContractToPayoutProposalItem(
    supabase: SupabaseClient,
    payoutProposalId: string,
    contract: Contract,
    workedHours: WorkedHours[],
) {
    const c = contract;

    const recipient = c.employee.recipient_payment_info?.[0];
    if (!recipient) {
        throw new Error(
            "Missing recipient for employee " + c.employee_id,
        );
    }

    const recipient_account = recipient.means_of_payment === "MPESA"
        ? recipient.mpesa_number
        : recipient.bank_account_number;

    const adjustments = await fetchPayAdjustmentsForEmployee(
        supabase,
        c.employee_id,
    );

    const hoursWorked =
        workedHours.find((h) => h.contract_id === c.id)?.hours || 0;

    const salaryCalc = new SalaryCalculator({
        baseSalary: c.base_salary,
        calculationBasis: c.calculation_basis,
        workPercentage: c.work_percentage,
        workQuantity: c.calculation_basis === "HOURLY" ? hoursWorked : 30,
    });

    const { benefits, deductions } = calculatePayAdjustments(
        adjustments as unknown as PayAdjustmentToEmployee[],
        salaryCalc,
    );

    salaryCalc.setPayAdjustments(benefits, deductions);

    const net_salary_last_month = await getLastMonthNetSalary(
        supabase,
        c.employee_id,
        c.id,
    );

    return {
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
        rpi_account: recipient_account,
        rpi_bank_routing: recipient.bank_routing_number,
        rpi_bank_name: recipient.bank_name,
        benefits,
        deductions,
        hours_worked: c.calculation_basis === "MONTHLY" ? null : hoursWorked,
        gross_salary: salaryCalc.grossSalary,
        net_salary: salaryCalc.netSalary,
        net_salary_last_month: parseFloat(
            net_salary_last_month.toFixed(2),
        ),
    };
}

export async function insertProposalItems(
    supabase: SupabaseClient,
    items: PayoutProposalItem[],
) {
    const { error: insertError } = await supabase
        .from("payout_proposal_items")
        .insert(items);

    if (insertError) throw insertError;
}
