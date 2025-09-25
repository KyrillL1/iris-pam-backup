export interface RequestBody {
    worked_hours?: {
        contract_id: string;
        hours: number;
    }[];
    include_contracts?: string[];
}

export interface PayoutProposalItem {
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

export interface Contract {
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

export interface WorkedHours {
    contract_id: string;
    hours: number;
}

export interface CalculatedPayAdjustment {
    id: string;
    name: string;
    amount: number;
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

export interface PayAdjustmentToEmployee {
    id: string;
    pay_adjustment_id: string;
    user_input?: number;
    pay_adjustment: PayAdjustment;
}
