import { PayoutProposal } from "@app/payout-proposals/payout-proposal-model";
import { Pending } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { truncateId } from "@utils/truncate-id";
import { JSX, useCallback, useMemo } from "react";

export function useStatusChip(status?: PayoutProposal["status"]) {
    const chip: JSX.Element | undefined = useMemo(() => {
        if (!status) {
            return undefined;
        }

        const color = status === "DRAFT"
            ? "warning"
            : status === "UNDER_REVIEW"
            ? "warning"
            : status === "APPROVED"
            ? "success"
            : status === "PAID_OUT"
            ? "success"
            : "error";
        return (
            <Chip
                label={`${status}`}
                color={color}
            />
        );
    }, [status]);

    return { chip };
}
