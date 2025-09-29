import { JSX } from "react";
import { Chip } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { formatMoney } from "@utils/format-money";
import { PayAdjustments, PayAdjustmentType } from "@lib/fetch-pay-adjustments";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add translation bundles
myI18n.addResourceBundle("en", "pay-adjustments", {
    adjustment: {
        defaultAmount: "Default {{amount}}",
        defaultPercentage: "Default {{percentage}}% of GS",
        defaultFormula: "Default {{formula}}",
    },
});

myI18n.addResourceBundle("pt", "pay-adjustments", {
    adjustment: {
        defaultAmount: "Padrão {{amount}}",
        defaultPercentage: "Padrão {{percentage}}% do GS",
        defaultFormula: "Padrão {{formula}}",
    },
});

export function payAdjustmentOptionFactory(p: PayAdjustments): JSX.Element {
    const { t } = useTranslation("pay-adjustments");

    let appendix = "";

    if (p.adjustment_type === PayAdjustmentType.AMOUNT) {
        appendix = p.amount
            ? `- ${
                t("adjustment.defaultAmount", { amount: formatMoney(p.amount) })
            }`
            : "";
    } else if (p.adjustment_type === PayAdjustmentType.GS_PERCENTAGE) {
        appendix = `- ${
            t("adjustment.defaultPercentage", { percentage: p.percentage })
        }`;
    } else if (p.adjustment_type === PayAdjustmentType.FORMULA) {
        appendix = `- ${
            t("adjustment.defaultFormula", { formula: p.formula })
        }`;
    }

    const label = `${p.name} ${appendix}`;

    return (
        <Chip
            icon={p.is_credit ? <Add /> : <Remove />}
            color={p.is_credit ? "success" : "error"}
            label={label}
        />
    );
}
