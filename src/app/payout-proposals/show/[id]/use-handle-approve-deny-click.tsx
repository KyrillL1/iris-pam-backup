import { useNavigation, useNotification } from "@refinedev/core";
import { useCallback, useEffect } from "react";
import { useApproveDenyProposal } from "./use-approve-deny-proposal";

export function useHandleApproveDenyClick(payoutProposalId?: string) {
    const { open } = useNotification();
    const { list } = useNavigation();
    const {
        denyData,
        denyError,
        denyProposal,

        approveData,
        approveError,
        approveProposal,
    } = useApproveDenyProposal();

    const handleApproveClick = useCallback(() => {
        if (!payoutProposalId) return;

        approveProposal(payoutProposalId);
    }, [payoutProposalId]);

    const handleDenyClick = useCallback(() => {
        if (!payoutProposalId) return;

        denyProposal(payoutProposalId);
    }, [payoutProposalId]);

    // ERROR HANDLING
    useEffect(() => {
        if (!denyError) return;

        const message = denyError.message;
        open?.({ message, type: "error" });
        console.error(denyError);
    }, [denyError]);
    useEffect(() => {
        if (!approveError) return;

        const message = approveError.message;
        open?.({ message, type: "error" });
        console.error(approveError);
    }, [approveError]);

    // SUCCESS HANDLING

    useEffect(() => {
        if (!denyData) return;

        const message = "Successfully denied";
        open?.({ message, type: "success" });
        list("payout_proposals");
    }, [denyData]);

    useEffect(() => {
        if (!approveData) return;

        const message = "Successfully approved";
        open?.({ message, type: "success" });
        list("payout_proposals");
    }, [approveData]);

    return {
        handleApproveClick,
        handleDenyClick,
    };
}
