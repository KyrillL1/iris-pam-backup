export interface PayoutProposalItemPayAdjustment {
    id: string;
    name: string;
    amount: number;
}

export interface PayoutProposalItem {
    id: string;
    created_at: string; // timestampz
    updated_at: string; // timestampz
    employee_id: string;
    employee_name: string;

    department_id: string;
    department_name: string;

    contract_id: string;
    contract_job_title: string;
    contract_base_salary: string;
    contract_work_percentage: string;
    contract_calculation_basis: "MONTHLY" | "HOURLY";
    benefits: PayoutProposalItemPayAdjustment[];
    deductions: PayoutProposalItemPayAdjustment[];

    gross_salary: number;
    hours_worked: number;
    net_salary: number;
    net_salary_last_month: number;

    rpi_id: string;
    rpi_name: string;
    rpi_payment_means: "MPESA" | "CHEQUE" | "CASH" | "BANK";
    rpi_account: string;
    rpi_bank_routing: number | null;
    rpi_bank_name: string | null;
}

export interface PayoutProposal {
    id: string;
    status: "DRAFT" | "APPROVED" | "UNDER_REVIEW" | "DENIED" | "PAID_OUT";
    items: PayoutProposalItem[];
    created_at: string;
    updated_at: string;
}
