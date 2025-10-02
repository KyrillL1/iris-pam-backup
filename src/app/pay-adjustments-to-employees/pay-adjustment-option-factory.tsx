import { JSX, useCallback } from "react";
import { Chip } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { formatMoney } from "@utils/format-money";
import { PayAdjustments, PayAdjustmentType } from "@lib/fetch-pay-adjustments";
import { useTranslationCommon } from "./pay-adjustments.common";
import { myI18n } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "pay-adjustment/factory", {
    defaultPercentage: "{{percentage}}% of GS",
});

myI18n.addResourceBundle("pt", "pay-adjustment/factory", {
    defaultPercentage: "{{percentage}}% do GS",
});

export function usePayAdjustmentOptionFactory() {
    const { t } = useTranslationCommon("pay-adjustment/factory");

    return useCallback((p: PayAdjustments) => {
        // Translate the adjustment name
        const translatedName = t(`names.${p.name}`, p.name);

        let appendix = "";

        if (p.adjustment_type === PayAdjustmentType.AMOUNT) {
            appendix = p.amount ? `- ${formatMoney(p.amount)}` : "";
        } else if (p.adjustment_type === PayAdjustmentType.GS_PERCENTAGE) {
            appendix = `- ${
                t("defaultPercentage", { percentage: p.percentage })
            }`;
        } else if (p.adjustment_type === PayAdjustmentType.FORMULA) {
            appendix = `- ${p.formula}`;
        }

        const label = `${translatedName} ${appendix}`;

        return (
            <Chip
                icon={p.is_credit ? <Add /> : <Remove />}
                color={p.is_credit ? "success" : "error"}
                label={label}
            />
        );
    }, [t]);
}
