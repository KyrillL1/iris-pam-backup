import { PayoutProposal } from "@app/payout-proposals/payout-proposal-model";
import { Cancel, Check, Preview, PriceCheck } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useMemo } from "react";
import { useHandleProposalChangeClick } from "./use-handle-proposal-change-click";

export function useButtonRow(
    record?: PayoutProposal,
    payslipEnrichedRows?: { payslip_blob: Blob & any }[],
) {
    const {
        handleApproveClick,
        handleDenyClick,
        handleRequestReviewClick,
        handleMarkAsPaid,
    } = useHandleProposalChangeClick(
        record?.id,
        payslipEnrichedRows,
    );

    const buttonRow = useMemo(() => {
        const status = record?.status;
        if (!status) return;

        const showRequest = status === "DRAFT";
        const showApprove = status === "UNDER_REVIEW";
        const showDeny = status === "UNDER_REVIEW";
        // const showPaidOut = status === "APPROVED";
        const showPaidOut = true; // TODO: Revert

        return (
            <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                    {showRequest && (
                        <Button
                            startIcon={<Preview />}
                            onClick={handleRequestReviewClick}
                        >
                            Request
                        </Button>
                    )}
                    {showApprove && (
                        <Button
                            startIcon={<Check />}
                            color="success"
                            onClick={handleApproveClick}
                        >
                            Approve
                        </Button>
                    )}
                    {showDeny && (
                        <Button
                            startIcon={<Cancel />}
                            color="error"
                            onClick={handleDenyClick}
                        >
                            Deny
                        </Button>
                    )}
                    {showPaidOut && (
                        <Button
                            startIcon={<PriceCheck />}
                            color="warning"
                            onClick={handleMarkAsPaid}
                        >
                            Mark As Paid
                        </Button>
                    )}
                </Box>
            </Box>
        );
    }, [record?.status]);

    return { buttonRow };
}
