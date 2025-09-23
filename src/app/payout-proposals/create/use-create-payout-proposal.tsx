import { supabaseBrowserClient } from "@utils/supabase/client";
import { useCallback, useState } from "react";

export interface CreatePayoutProposalData {
    contract_id: string;
    hours: number;
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
        async (createData: CreatePayoutProposalData[]) => {
            setLoading(true);
            const { data, error } = await supabaseBrowserClient
                .functions
                .invoke<CreatePayoutProposalResponseData>(
                    "create-payout-proposal",
                    {
                        body: { worked_hours: createData },
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
