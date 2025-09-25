import { useCallback, useState } from "react";

export interface CreatePayoutProposalBody {
    worked_hours: {
        contract_id: string;
        hours: number;
    }[];
    include_contracts: string[];
}

interface CreatePayoutProposalResponseData {
    message: string;
    meta: {
        id: string; // payout_proposal_id
    };
}

export function useCreatePayoutProposal() {
    const [data, setData] = useState<CreatePayoutProposalResponseData>();
    const [error, setError] = useState<Error>();
    const [loading, setLoading] = useState(false);

    const createPayoutProposal = useCallback(
        async (body: CreatePayoutProposalBody) => {
            setLoading(true);
            setError(undefined);

            try {
                const res = await fetch("/api/create-payout-proposal", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });

                const result: CreatePayoutProposalResponseData = await res
                    .json();

                if (!res.ok) {
                    throw new Error(result?.message || "Unknown error");
                }

                setData(result);
                setLoading(false);

                return { data: result, error: null };
            } catch (err: any) {
                const msg = err instanceof Error ? err.message : String(err);
                setError(new Error(msg));
                setData(undefined);
                setLoading(false);
                return { data: null, error: new Error(msg) };
            }
        },
        [],
    );

    return {
        createPayoutProposal,
        data,
        error,
        loading,
    };
}
