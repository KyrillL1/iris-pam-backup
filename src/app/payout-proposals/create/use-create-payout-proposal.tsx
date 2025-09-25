import { supabaseBrowserClient } from "@utils/supabase/client";
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
            const { data, error } = await supabaseBrowserClient
                .functions
                .invoke<CreatePayoutProposalResponseData>(
                    "create-payout-proposal",
                    {
                        body,
                    },
                );

            if (error || !data) {
                const msg = (await error?.context?.json?.())?.message ||
                    error?.message || error?.data?.message || "Unknown Error";
                setError(new Error(msg));
                setData(undefined);
                setLoading(false);
                return {
                    data: null,
                    error: new Error(msg),
                };
            }

            setLoading(false);
            setData(data);
            setError(undefined);
            return { data, error };
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
