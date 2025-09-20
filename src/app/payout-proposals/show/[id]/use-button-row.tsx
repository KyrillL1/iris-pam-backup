import { PayoutProposal } from "@app/payout-proposals/payout-proposal-model";
import { Cancel, Check, Preview, PriceCheck } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useMemo } from "react";
import { useHandleProposalChangeClick } from "./use-handle-proposal-change-click";

export function useButtonRow(record?: PayoutProposal) {
    const { handleApproveClick, handleDenyClick, handleRequestReviewClick } =
        useHandleProposalChangeClick(
            record?.id,
        );

    const buttonRow = useMemo(() => {
        const status = record?.status;
        if (!status) return;

        const showRequest = status === "DRAFT";
        const showApprove = status === "UNDER_REVIEW";
        const showDeny = status === "UNDER_REVIEW";
        const showPaidOut = status === "APPROVED";

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
                            onClick={() => {
                                throw new Error("Please implement");
                            }}
                        >
                            Paid Out
                        </Button>
                    )}
                </Box>
            </Box>
        );
    }, [record?.status]);

    return { buttonRow };
}
