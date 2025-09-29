"use client";

import { Show, ShowField } from "@components/show";
import { PayAdjustmentsToEmployeesWithRelations } from "@lib/fetch-pay-adjustments";
import { useShow } from "@refinedev/core";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add translation bundles
myI18n.addResourceBundle("en", "pay-adjustments-show", {
  id: "ID",
  createdAt: "Created At",
  updatedAt: "Updated At",
  employeeName: "Employee Name",
  type: "Type",
  benefit: "Benefit",
  deduction: "Deduction",
  benefitName: "Benefit Name",
  deductionName: "Deduction Name",
  comment: "Comment",
  userInput: "User Input",
  startDate: "Start Date",
  endDate: "End Date",
  none: "-",
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

myI18n.addResourceBundle("pt", "pay-adjustments-show", {
  id: "ID",
  createdAt: "Criado em",
  updatedAt: "Atualizado em",
  employeeName: "Nome do Funcionário",
  type: "Tipo",
  benefit: "Benefício",
  deduction: "Desconto",
  benefitName: "Nome do Benefício",
  deductionName: "Nome do Desconto",
  comment: "Comentário",
  userInput: "Entrada do Usuário",
  startDate: "Data de Início",
  endDate: "Data de Fim",
  none: "-",
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

export default function PayAdjustmentsToEmployeesShow() {
  const { t } = useTranslation("pay-adjustments-show");

  const { query } = useShow<PayAdjustmentsToEmployeesWithRelations>({
    meta: {
      select: `
                *,
                employee:employees(first_name, last_name),
                pay_adjustment:pay_adjustments(id, name)
            `,
    },
  });
  const { data, isLoading } = query;
  const record = data?.data;

  console.log({ name: record?.pay_adjustment?.name });
  const fields: ShowField[] = [
    { label: t("id"), value: record?.id },
    { label: t("createdAt"), value: record?.created_at, type: "datetime" },
    { label: t("updatedAt"), value: record?.updated_at, type: "datetime" },
    {
      label: t("employeeName"),
      value: `${record?.employee?.first_name} ${record?.employee?.last_name}`,
    },
    {
      label: t("type"),
      value: record?.pay_adjustment?.is_credit ? t("benefit") : t("deduction"),
    },
    {
      label: record?.pay_adjustment?.is_credit
        ? t("benefitName")
        : t("deductionName"),
      value: t(`payAdjustmentNames.${record?.pay_adjustment?.name}`),
    },
    { label: t("comment"), value: record?.comment || t("none") },
    { label: t("userInput"), value: record?.userInput || t("none") },
    { label: t("startDate"), value: record?.start_date, type: "date" },
    { label: t("endDate"), value: record?.end_date, type: "date" },
  ];

  return <Show isLoading={isLoading} fields={fields} />;
}
