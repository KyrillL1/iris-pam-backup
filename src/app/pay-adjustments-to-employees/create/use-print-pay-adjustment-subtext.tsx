import { useCallback } from "react";
import { Chip, FormHelperText } from "@mui/material";
import { PayAdjustments, PayAdjustmentType } from "@lib/fetch-pay-adjustments";

export function usePrintPayAdjustmentSubtext() {
    const printPayAdjustmentSubtext = useCallback((payAdjustment?: PayAdjustments) => {
        if (!payAdjustment) return;

        const benefitOrDeduction = payAdjustment.is_credit ?
            <Chip component="span" label="Benefit" color="success" sx={{ marginRight: 2 }} /> :
            <Chip component="span" label="Deduction" color="error" sx={{ marginRight: 2 }} />
        const type = payAdjustment.adjustment_type;
        let defaultValue = "";
        if (type === PayAdjustmentType.AMOUNT) {
            defaultValue = payAdjustment.amount ? payAdjustment.amount?.toString() : "";
        }
        if (type === PayAdjustmentType.GS_PERCENTAGE) {
            defaultValue = payAdjustment.percentage ? `${payAdjustment.percentage}% of Gross salary` : ""
        }
        if (type === PayAdjustmentType.FORMULA) {
            defaultValue = payAdjustment.formula || ""
        }
        return <FormHelperText>{benefitOrDeduction}{`  ${type}: ${defaultValue}`}</FormHelperText>
    }, []);

    return {
        printPayAdjustmentSubtext
    }
}