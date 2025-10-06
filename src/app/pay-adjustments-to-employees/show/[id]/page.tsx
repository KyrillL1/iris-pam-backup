"use client";

import { Show, ShowField } from "@components/show";
import { PayAdjustmentsToEmployeesWithRelations } from "@lib/fetch-pay-adjustments";
import { useShow } from "@refinedev/core";
import { myI18n, useTranslation } from "@i18n/i18n-provider";
import { useTranslationCommon } from "../../pay-adjustments.common";

// Add translation bundles
myI18n.addResourceBundle("en", "payadjustments/show", {
  type: "Type",
  benefit: "Benefit",
  deduction: "Deduction",
  benefitName: "Benefit Name",
  deductionName: "Deduction Name",
  none: "-",
});

myI18n.addResourceBundle("pt", "payadjustments/show", {
  type: "Tipo",
  benefit: "Benefício",
  deduction: "Desconto",
  benefitName: "Nome do Benefício",
  deductionName: "Nome do Desconto",
  none: "-",
});

export default function PayAdjustmentsToEmployeesShow() {
  const { t } = useTranslationCommon("payadjustments/show");

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
    {
      label: t("fields.employee_name"),
      value: `${record?.employee?.first_name} ${record?.employee?.last_name}`,
    },
    {
      label: t("payadjustments/show:type"),
      value: record?.pay_adjustment?.is_credit
        ? t("payadjustments/show:benefit")
        : t("payadjustments/show:deduction"),
    },
    {
      label: record?.pay_adjustment?.is_credit
        ? t("payadjustments/show:benefitName")
        : t("payadjustments/show:deductionName"),
      value: t(`payAdjustmentNames.${record?.pay_adjustment?.name}`),
    },
    {
      label: t("fields.comment"),
      value: record?.comment || t("payadjustments/show:none"),
    },
    {
      label: t("fields.user_input"),
      value: record?.userInput || t("payadjustments/show:none"),
    },
    { label: t("fields.start_date"), value: record?.start_date, type: "date" },
    { label: t("fields.end_date"), value: record?.end_date, type: "date" },
  ];

  return <Show isLoading={isLoading} fields={fields} record={record} />;
}
