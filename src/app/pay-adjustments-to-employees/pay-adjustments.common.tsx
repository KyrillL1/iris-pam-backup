// Common translations

import { myI18n, useTranslation } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "payadjustments/common", {
    fields: {
        employee_name: "Employee Name",
        pay_adjustment_id: "Benefit / Deduction Name",
        comment: "Comment",
        user_input: "User Input",
        start_date: "Start Date",
        end_date: "End Date",
    },
    payAdjustmentNames: {
        NIGHT_SHIFT_BONUS: "Night Shift Bonus",
        LIFE_RISK_BONUS: "Life Risk Bonus",
        OTHER_DEDUCTION: "Other Deduction",
        INSS: "INSS",
        FLEXIBLE_HOURS_BONUS: "Flexible Hours Bonus",
        PUBLIC_HOLIDAYS_BONUS: "Public Holidays Bonus",
        CHRISTMAS_BONUS: "Christmas Bonus",
        IRPS: "IRPS",
        LOANS: "Loans",
        MISSED_WORKDAYS: "Missed Work Days",
        SINDICATO: "Sindicato",
        ADVANCES: "Advances",
        MISSED_WORKHOURS: "Missed Work Hours",
        CHRONIC_DISEASE_BONUS: "Chronic Disease Bonus",
        SUPERVISOR_BONUS: "Supervisor Bonus",
        EXTRA_HOURS: "Extra Hours",
        SPECIAL_EXTRA_HOURS: "Special Extra Hours",
        OTHER_BENEFIT: "Other Benefit",
        SCHOOL_HOURS_ADDITIONAL: "School Hours Additional",
    },
});

myI18n.addResourceBundle("pt", "payadjustments/common", {
    fields: {
        employee_name: "Nome do Funcionário",
        pay_adjustment_id: "Nome do Benefício / Desconto",
        comment: "Comentário",
        user_input: "Entrada do Usuário",
        start_date: "Data de Início",
        end_date: "Data de Término",
    },
    payAdjustmentNames: {
        NIGHT_SHIFT_BONUS: "Bônus de Turno Noturno",
        LIFE_RISK_BONUS: "Bônus de Risco de Vida",
        OTHER_DEDUCTION: "Outro Desconto",
        INSS: "INSS",
        FLEXIBLE_HOURS_BONUS: "Bônus de Horário Flexível",
        PUBLIC_HOLIDAYS_BONUS: "Bônus de Feriados",
        CHRISTMAS_BONUS: "Bônus de Natal",
        IRPS: "IRPS",
        LOANS: "Empréstimos",
        MISSED_WORKDAYS: "Dias de Trabalho Perdidos",
        SINDICATO: "Sindicato",
        ADVANCES: "Adiantamentos",
        MISSED_WORKHOURS: "Horas de Trabalho Perdidas",
        CHRONIC_DISEASE_BONUS: "Bônus por Doença Crônica",
        SUPERVISOR_BONUS: "Bônus de Supervisor",
        EXTRA_HOURS: "Horas Extras",
        SPECIAL_EXTRA_HOURS: "Horas Extras Especiais",
        OTHER_BENEFIT: "Outro Benefício",
        SCHOOL_HOURS_ADDITIONAL: "Adicional de Horário Escolar",
    },
});

export function useTranslationCommon(additionalNs: string = "") {
    return useTranslation([
        "payadjustments/common",
        additionalNs,
    ]);
}
