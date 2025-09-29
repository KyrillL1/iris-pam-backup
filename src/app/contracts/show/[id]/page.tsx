"use client";

import { Show, ShowField } from "@components/show";
import { ContractWithRelations } from "@lib/fetch-contracts";
import { useShow } from "@refinedev/core";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "contracts/show", {
  fields: {
    id: "ID",
    created_at: "Created At",
    updated_at: "Updated At",
    department: "Department",
    job_title: "Job Title",
    contract_type: "Contract Type",
    determined: "Determined",
    work_percentage: "Work %",
    start_date: "Start Date",
    end_date: "End Date",
    calculation_basis: "Calculation",
    base_salary: "Base Salary",
  },
});

myI18n.addResourceBundle("pt", "contracts/show", {
  fields: {
    id: "ID",
    created_at: "Criado Em",
    updated_at: "Atualizado Em",
    department: "Departamento",
    job_title: "Cargo",
    contract_type: "Tipo de Contrato",
    determined: "Determinada",
    work_percentage: "Trabalho %",
    start_date: "Data Início",
    end_date: "Data Fim",
    calculation_basis: "Cálculo",
    base_salary: "Salário Base",
  },
});

export default function ContractsShow() {
  const { t } = useTranslation("contracts/show");

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
    { label: t("fields.id"), value: record?.id },
    {
      label: t("fields.created_at"),
      value: record?.created_at,
      type: "datetime",
    },
    {
      label: t("fields.updated_at"),
      value: record?.updated_at,
      type: "datetime",
    },
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

  return <Show isLoading={isLoading} fields={fields} />;
}
