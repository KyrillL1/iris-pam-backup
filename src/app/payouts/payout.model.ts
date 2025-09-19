export interface PayoutModel {
    id: string;
    created_at: string;
    updated_at: string;
    employee_id: string;
    amount: number;
    payout_slip_path: string;
}

export interface PayoutModelWithRelations extends PayoutModel {
    employee?: {
        first_name: string;
        last_name: string
    }
}