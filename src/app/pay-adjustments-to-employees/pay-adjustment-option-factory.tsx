import { JSX } from "react";
import { Chip } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { formatMoney } from "@utils/format-money";
import { PayAdjustments, PayAdjustmentType } from "@lib/fetch-pay-adjustments";
import { myI18n, useTranslation } from "@i18n/i18n-provider";
import { tServer } from "@i18n/translate-server-side";

// Add translation bundles
myI18n.addResourceBundle("en", "pay-adjustments-factory", {
    adjustment: {
        defaultPercentage: "{{percentage}}% of GS",
    },
    names: {
        NIGHT_SHIFT_BONUS: "Night Shift Bonus",
        LIFE_RISK_BONUS: "Life Risk Bonus",
        OTHER_DEDUCTION: "Other Deduction",
        INSS: "INSS",
        FLEXIBLE_HOURS_BONUS: "Flexible Hours Bonus",
        PUBLIC_HOLIDAYS_BONUS: "Public Holidays Bonus",
        CHRISTMAS_BONUS: "Christmas Bonus",
        IRPS: "IRPS",
        LOANS: "Loans",
        MISSED_WORK_DAYS: "Missed Work Days",
        SINDICATO: "Sindicato",
        ADVANCES: "Advances",
        MISSED_WORK_HOURS: "Missed Work Hours",
        CHRONIC_DISEASE_BONUS: "Chronic Disease Bonus",
        SUPERVISOR_BONUS: "Supervisor Bonus",
        EXTRA_HOURS: "Extra Hours",
        SPECIAL_EXTRA_HOURS: "Special Extra Hours",
        OTHER_BENEFIT: "Other Benefit",
        SCHOOL_HOURS_ADDITIONAL: "School Hours Additional",
    },
});

myI18n.addResourceBundle("pt", "pay-adjustments-factory", {
    adjustment: {
        defaultPercentage: "{{percentage}}% do GS",
    },
    names: {
        NIGHT_SHIFT_BONUS: "Bônus Turno Noturno",
        LIFE_RISK_BONUS: "Bônus Risco de Vida",
        OTHER_DEDUCTION: "Outro Desconto",
        INSS: "INSS",
        FLEXIBLE_HOURS_BONUS: "Bônus Horas Flexíveis",
        PUBLIC_HOLIDAYS_BONUS: "Bônus Feriados",
        CHRISTMAS_BONUS: "Bônus Natal",
        IRPS: "IRPS",
        LOANS: "Adiantamentos",
        MISSED_WORK_DAYS: "Dias de Falta",
        SINDICATO: "Sindicato",
        ADVANCES: "Adiantamentos",
        MISSED_WORK_HOURS: "Horas de Falta",
        CHRONIC_DISEASE_BONUS: "Bônus Doença Crônica",
        SUPERVISOR_BONUS: "Bônus Supervisor",
        EXTRA_HOURS: "Horas Extras",
        SPECIAL_EXTRA_HOURS: "Horas Extras Especiais",
        OTHER_BENEFIT: "Outro Benefício",
        SCHOOL_HOURS_ADDITIONAL: "Horas Adicionais Escola",
    },
});

export function payAdjustmentOptionFactory(p: PayAdjustments): JSX.Element {
    const t = tServer("pay-adjustments-factory");

    // Translate the adjustment name
    const translatedName = t(`names.${p.name}`, p.name);

    let appendix = "";

    if (p.adjustment_type === PayAdjustmentType.AMOUNT) {
        appendix = p.amount ? `- ${formatMoney(p.amount)}` : "";
    } else if (p.adjustment_type === PayAdjustmentType.GS_PERCENTAGE) {
        appendix = `- ${
            t("adjustment.defaultPercentage", { percentage: p.percentage })
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
}
