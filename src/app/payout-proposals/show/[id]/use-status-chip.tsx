import { PayoutProposal } from "@app/payout-proposals/payout-proposal-model";
import { Pending } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { JSX, useCallback, useMemo } from "react";

export function useStatusChip(status?: PayoutProposal["status"]) {
    const chip: JSX.Element = useMemo(() => {
        if (!status) {
            return <Chip disabled icon={<Pending />} />;
        }

        const color = status === "DRAFT"
            ? "warning"
            : status === "APPROVED"
            ? "success"
            : "error";
        return <Chip label={status} color={color} />;
    }, [status]);

    return { chip };
}
