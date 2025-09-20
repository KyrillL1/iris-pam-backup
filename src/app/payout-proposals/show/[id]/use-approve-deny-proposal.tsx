import { supabaseBrowserClient } from "@utils/supabase/client";
import { useCallback, useState } from "react";

export function useApproveDenyProposal() {
    const [approveData, setApproveData] = useState<any[]>();
    const [approveError, setApproveError] = useState<Error>();

    const approveProposal = useCallback(async (id: string) => {
        const { data, error } = await supabaseBrowserClient
            .from(
                "payout_proposals",
            ).update({ status: "APPROVED" })
            .eq("id", id)
            .select();

        if (error || !data) {
            setApproveError(
                error || new Error("Missing data for payout proposal, denied"),
            );
            return {
                data: null,
                error,
            };
        }

        setApproveData(data);
        return { data, error: null };
    }, []);

    const [denyData, setDenyData] = useState<any[]>();
    const [denyError, setDenyError] = useState<Error>();

    const denyProposal = useCallback(async (id: string) => {
        const { data, error } = await supabaseBrowserClient.from(
            "payout_proposals",
        ).update({ status: "DENIED" }).eq("id", id).select();

        if (error || !data) {
            setDenyError(
                error || new Error("Missing data for payout proposal, denied"),
            );
            return {
                data: null,
                error,
            };
        }

        setDenyData(data);
        return { data, error: null };
    }, []);

    return {
        approveData,
        approveError,
        approveProposal,
        denyData,
        denyError,
        denyProposal,
    };
}
