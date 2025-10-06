"use client";

import { Show, ShowField } from "@components/show";
import { ContractWithRelations } from "@lib/fetch-contracts";
import { useShow } from "@refinedev/core";
import { useTranslationCommon } from "@app/contracts/contracts.common";

export default function ContractsShow() {
  const { t } = useTranslationCommon();

  const { query } = useShow<ContractWithRelations>({
    meta: {
      select: `
        *,
        department:departments(name)
      `,
    },
  });
  const { data, isLoading } = query;

  const record = data?.data;

  const fields: ShowField[] = [
    { label: t("fields.department"), value: record?.department?.name },
    { label: t("fields.job_title"), value: record?.job_title },
    { label: t("fields.contract_type"), value: record?.contract_type },
    {
      label: t("fields.determined"),
      value: record?.determined,
      type: "boolean",
    },
    {
      label: t("fields.work_percentage"),
      value: record?.work_percentage,
      type: "number",
    },
    { label: t("fields.start_date"), value: record?.start_date, type: "date" },
    { label: t("fields.end_date"), value: record?.end_date, type: "date" },
    { label: t("fields.calculation_basis"), value: record?.calculation_basis },
    {
      label: t("fields.base_salary"),
      value: record?.base_salary,
      type: "money",
    },
  ];

  return <Show isLoading={isLoading} fields={fields} record={record} />;
}
