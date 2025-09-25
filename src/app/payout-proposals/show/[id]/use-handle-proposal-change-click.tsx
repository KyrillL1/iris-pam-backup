import { useNavigation, useNotification } from "@refinedev/core";
import { useCallback, useEffect, useRef } from "react";
import { useChangeProposalStatus } from "./use-change-proposal-status";
import {
    MarkProposalPaidItems,
    useMarkProposalPaid,
} from "./use-mark-proposal-paid";
import { useHandleError } from "@utils/use-handle-error";

export function useHandleProposalChangeClick(
    payoutProposalId?: string,
    payslipEnrichedRows?: { payslip_blob: Blob & any }[],
) {
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
    const {
        markProposalPaid,
        markProposalPaidError,
        finished: markProposalPaidFinished,
    } = useMarkProposalPaid();

    const rowsRef = useRef(payslipEnrichedRows);

    useEffect(() => {
        // Need to use ref here, as otherwise my handleMarkAsPaid.payslipEnrichedRows === undefined
        rowsRef.current = payslipEnrichedRows;
    }, [payslipEnrichedRows]);

    const handleMarkAsPaid = useCallback(() => {
        if (!payoutProposalId) return;
        if (!rowsRef.current) return;

        const items: MarkProposalPaidItems[] = rowsRef.current.map(
            (i: any) => {
                return {
                    amount: i.net_salary,
                    payoutProposalItemId: i.id,
                    payslipBlob: i.payslip_blob,
                };
            },
        );
        markProposalPaid(payoutProposalId, items);
    }, [payoutProposalId]);

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
    useHandleError(denyError);
    useHandleError(approveError);
    useHandleError(requestReviewError);
    useHandleError(markProposalPaidError);
    
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

    useEffect(() => {
        if (!markProposalPaidFinished) return;

        const message = "Successfully marked payout proposal as paid";
        open?.({ message, type: "success" });
        list("payouts");
    }, [markProposalPaidFinished]);

    return {
        handleApproveClick,
        handleDenyClick,
        handleRequestReviewClick,
        handleMarkAsPaid,
    };
}
