"use client";

import { useCallback } from "react";
import { Chip, FormHelperText } from "@mui/material";
import { PayAdjustments, PayAdjustmentType } from "@lib/fetch-pay-adjustments";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add translation bundles
myI18n.addResourceBundle("en", "pay-adjustment-subtext", {
    benefit: "Benefit",
    deduction: "Deduction",
    percentageOfGS: "Percentage of Gross Salary",
    formula: "Formula",
});

myI18n.addResourceBundle("pt", "pay-adjustment-subtext", {
    benefit: "Benefício",
    deduction: "Desconto",
    percentageOfGS: "Porcentagem do Salário Bruto",
});

export function usePrintPayAdjustmentSubtext() {
    const { t } = useTranslation("pay-adjustment-subtext");

    const printPayAdjustmentSubtext = useCallback(
        (payAdjustment?: PayAdjustments) => {
            if (!payAdjustment) return null;

            const benefitOrDeduction = payAdjustment.is_credit
                ? (
                    <Chip
                        component="span"
                        label={t("benefit")}
                        color="success"
                        sx={{ marginRight: 2 }}
                    />
                )
                : (
                    <Chip
                        component="span"
                        label={t("deduction")}
                        color="error"
                        sx={{ marginRight: 2 }}
                    />
                );

            const type = payAdjustment.adjustment_type;
            let defaultValue = "";

            if (type === PayAdjustmentType.AMOUNT) {
                defaultValue = payAdjustment.amount
                    ? payAdjustment.amount.toString()
                    : "";
            } else if (type === PayAdjustmentType.GS_PERCENTAGE) {
                defaultValue = payAdjustment.percentage
                    ? `${payAdjustment.percentage}% ${t("percentageOfGS")}`
                    : "";
            } else if (type === PayAdjustmentType.FORMULA) {
                defaultValue = payAdjustment.formula || "";
            }

            return (
                <FormHelperText>
                    {benefitOrDeduction} {`${defaultValue}`}
                </FormHelperText>
            );
        },
        [t],
    );

    return { printPayAdjustmentSubtext };
}
