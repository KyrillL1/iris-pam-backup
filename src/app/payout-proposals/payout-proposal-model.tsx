export interface PayoutProposalItem {
    id: string;
}

export interface PayoutProposal {
    id: string;
    status: "DRAFT" | "APPROVED" | "UNDER_REVIEW";
    items: PayoutProposalItem[];
}
