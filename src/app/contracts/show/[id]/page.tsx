"use client";

import { Show, ShowField } from "@components/show";
import { ContractWithRelations } from "@lib/fetch-contracts";
import { useShow } from "@refinedev/core";

export default function ContractsShow() {
  const { query } = useShow<ContractWithRelations>({
    meta: {
      select: `
        *,
        department:departments(name)
      `
    }
  });
  const { data, isLoading } = query;

  const record = data?.data;

  const fields: ShowField[] = [
    { label: "ID", value: record?.id },
    { label: "Created At", value: record?.created_at, type: "datetime" },
    { label: "Updated At", value: record?.updated_at, type: "datetime" },
    { label: "Department", value: record?.department.name },
    { label: "Job Title", value: record?.job_title },
    { label: "Contract Type", value: record?.contract_type },
    { label: "Determined", value: record?.determined, type: "boolean" },
    { label: "Work %", value: record?.work_percentage, type: "number" },
    { label: "Start Date", value: record?.start_date, type: "date" },
    { label: "End Date", value: record?.end_date, type: "date" },
    { label: "Calculation", value: record?.calculation_basis },
    { label: "Base Salary", value: record?.base_salary, type: "money" },
  ];

  return <Show isLoading={isLoading} fields={fields} />;
}
