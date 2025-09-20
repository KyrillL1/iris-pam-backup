import { useNavigation, useNotification } from "@refinedev/core";
import { useCallback, useEffect } from "react";
import { useChangeProposalStatus } from "./use-change-proposal-status";

export function useHandleProposalChangeClick(payoutProposalId?: string) {
    const { open } = useNotification();
    const { list } = useNavigation();
    const {
        denyData,
        denyError,
        denyProposal,

        approveData,
        approveError,
        approveProposal,

        requestReview,
        requestReviewData,
        requestReviewError,
    } = useChangeProposalStatus();

    const handleApproveClick = useCallback(() => {
        if (!payoutProposalId) return;

        approveProposal(payoutProposalId);
    }, [payoutProposalId]);

    const handleDenyClick = useCallback(() => {
        if (!payoutProposalId) return;

        denyProposal(payoutProposalId);
    }, [payoutProposalId]);

    const handleRequestReviewClick = useCallback(() => {
        if (!payoutProposalId) return;

        requestReview(payoutProposalId);
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
    useEffect(() => {
        if (!requestReviewError) return;

        const message = requestReviewError.message;
        open?.({ message, type: "error" });
        console.error(requestReviewError);
    }, [requestReviewError]);

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

    useEffect(() => {
        if (!requestReviewData) return;

        const message = "Successfully requested review";
        open?.({ message, type: "success" });
        list("payout_proposals");
    }, [requestReviewData]);

    return {
        handleApproveClick,
        handleDenyClick,
        handleRequestReviewClick,
    };
}
