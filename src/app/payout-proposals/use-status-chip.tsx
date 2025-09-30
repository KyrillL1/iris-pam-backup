import { PayoutProposal } from "@app/payout-proposals/payout-proposal-model";
import { Pending } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { truncateId } from "@utils/truncate-id";
import { JSX, useCallback, useMemo } from "react";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Optional: add translations for statuses
myI18n.addResourceBundle("en", "payout-proposal/status", {
    DRAFT: "Draft",
    UNDER_REVIEW: "Under Review",
    APPROVED: "Approved",
    PAID_OUT: "Paid Out",
    REJECTED: "Rejected",
});

myI18n.addResourceBundle("pt", "payout-proposal/status", {
    DRAFT: "Rascunho",
    UNDER_REVIEW: "Em Revisão",
    APPROVED: "Aprovado",
    PAID_OUT: "Pago",
    REJECTED: "Rejeitado",
});

export function useStatusChip(status?: PayoutProposal["status"]) {
    const { t } = useTranslation("payout-proposal/status");

    const generateChip = (status?: PayoutProposal["status"]) => {
        if (!status) return undefined;

        const color = status === "DRAFT" || status === "UNDER_REVIEW"
            ? "warning"
            : status === "APPROVED" || status === "PAID_OUT"
            ? "success"
            : "error";

        return (
            <Chip
                label={t(status)}
                color={color}
            />
        );
    };

    const chip: JSX.Element | undefined = useMemo(() => generateChip(status), [
        status,
        t,
    ]);

    return { chip, generateChip };
}
