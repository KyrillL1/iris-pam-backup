export interface PayoutModel {
    id: string;
    created_at: string;
    updated_at: string;
    contract_id: string;
    amount: number;
    payout_slip_path: string;
}

export interface PayoutModelWithRelations {
    id: string;
    created_at: string;
    updated_at: string;
    contract_id: string;
    amount: number;
    payout_slip_path: string;

    payout_proposal_item_id: string;
    payout_proposal_item: {
        employee_id: string;
        contract_job_title: string;
        employee: {
            first_name: string;
            last_name: string;
        } | null;
    } | null;
}
