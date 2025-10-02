"use client";

import { Show, ShowField } from "@components/show";
import { PayAdjustmentsToEmployeesWithRelations } from "@lib/fetch-pay-adjustments";
import { useShow } from "@refinedev/core";
import { myI18n } from "@i18n/i18n-provider";
import { useTranslationCommon } from "../../pay-adjustments.common";

// Add translation bundles
myI18n.addResourceBundle("en", "pay-adjustments/show", {
  id: "ID",
  createdAt: "Created At",
  updatedAt: "Updated At",
  type: "Type",
  benefit: "Benefit",
  deduction: "Deduction",
  benefitName: "Benefit Name",
  deductionName: "Deduction Name",
  none: "-",
});

myI18n.addResourceBundle("pt", "pay-adjustments/show", {
  id: "ID",
  createdAt: "Criado em",
  updatedAt: "Atualizado em",
  type: "Tipo",
  benefit: "Benefício",
  deduction: "Desconto",
  benefitName: "Nome do Benefício",
  deductionName: "Nome do Desconto",
  none: "-",
});

export default function PayAdjustmentsToEmployeesShow() {
  const { t, i18n } = useTranslationCommon("pay-adjustments/show");
  // TODO: Fix this view

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

  const fields: ShowField[] = [
    { label: t("id"), value: record?.id },
    { label: t("createdAt"), value: record?.created_at, type: "datetime" },
    { label: t("updatedAt"), value: record?.updated_at, type: "datetime" },
    {
      label: t("fields.employee_name"),
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
    { label: t("fields.comment"), value: record?.comment || t("none") },
    { label: t("fields.user_input"), value: record?.userInput || t("none") },
    { label: t("fields.start_date"), value: record?.start_date, type: "date" },
    { label: t("fields.end_date"), value: record?.end_date, type: "date" },
  ];

  return <Show isLoading={isLoading} fields={fields} />;
}
