import { PayoutProposal } from "@app/payout-proposals/payout-proposal-model";
import { Pending } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { truncateId } from "@utils/truncate-id";
import { JSX, useCallback, useMemo } from "react";

export function useStatusChip(status?: PayoutProposal["status"], id?: string) {
    const chip: JSX.Element = useMemo(() => {
        if (!status) {
            return <Chip disabled icon={<Pending />} />;
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
                label={`${status} ${id ? truncateId(id, 9) : ""}`}
                color={color}
            />
        );
    }, [status, id]);

    return { chip };
}
