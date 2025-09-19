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

    const createPayoutProposal = useCallback(
        async (createData: CreatePayoutProposalData[]) => {
            const { data, error } = await supabaseBrowserClient
                .functions
                .invoke<CreatePayoutProposalResponseData>(
                    "create-payout-proposal",
                    {
                        body: { worked_hours: createData },
                    },
                );

            if (error || !data) {
                setError(error);
                return {
                    data: null,
                    error,
                };
            }

            setData(data);
            return { data, error };
        },
        [],
    );

    return {
        createPayoutProposal,
        data,
        error,
    };
}
