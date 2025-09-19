import { JSX } from "react";
import { Chip } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { formatMoney } from "@utils/format-money";
import { PayAdjustments, PayAdjustmentType } from "@lib/fetch-pay-adjustments";

export function payAdjustmentOptionFactory(p: PayAdjustments): JSX.Element {
    let appendix: string = "";
    if (p.adjustment_type === PayAdjustmentType.AMOUNT) {
        appendix = p.amount ? `- Default ${formatMoney(p.amount)}` : "";
    } else if (p.adjustment_type === PayAdjustmentType.GS_PERCENTAGE) {
        appendix = `- Default ${p.percentage}% of GS`;
    } else if (p.adjustment_type === PayAdjustmentType.FORMULA) {
        appendix = `- Default ${p.formula}`
    }
    const labeL = `${p.name} ${appendix}`;
    return <Chip icon={p.is_credit ? <Add /> : <Remove />} color={p.is_credit ? "success" : "error"} label={labeL} />
}
