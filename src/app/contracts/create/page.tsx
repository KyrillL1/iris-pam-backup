"use client";

import { useFetchEmployees } from "@lib/fetch-employees";
import { Create, CreateFieldConfig } from "@components/create";
import { useFetchDepartments } from "@lib/fetch-departments";
import { useTranslationCommon } from "../contracts.common";

export default function ContractCreate() {
  const { t } = useTranslationCommon();
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();
  const { departments } = useFetchDepartments();

  const fields: CreateFieldConfig[] = [
    {
      name: "employee_id",
      label: t("fields.employee_name"),
      type: "select",
      options: employeeIds,
      mapOptionToLabel: mapEmployeeIdToName,
      required: true,
    },
    {
      name: "department_id",
      label: t("fields.department_name"),
      type: "select",
      options: departments.map((d) => d.id),
      mapOptionToLabel: (id) =>
        departments.find((d) => d.id === id)?.name || id,
      required: true,
    },
    {
      name: "job_title",
      label: t("fields.job_title"),
      type: "text",
    },
    {
      name: "contract_type",
      label: t("fields.contract_type"),
      type: "select",
      options: ["FREELANCER", "REGULAR", "TEMPORARY"],
      required: true,
      mapOptionToLabel: (option: string) =>
        option ? t(`options.contract_type.${option}`) : "",
    },
    {
      name: "determined",
      label: t("fields.determined"),
      type: "boolean",
    },
    {
      name: "calculation_basis",
      label: t("fields.calculation_basis"),
      type: "select",
      options: ["MONTHLY", "HOURLY"],
      required: true,
      mapOptionToLabel: (option: string) =>
        option ? t(`options.calculation_basis.${option}`) : "",
    },
    {
      name: "work_percentage",
      label: t("fields.work_percentage"),
      type: "number",
      min: 0,
      max: 100,
      required: true,
    },
    {
      name: "start_date",
      label: t("fields.start_date"),
      type: "date",
      required: true,
    },
    {
      name: "end_date",
      label: t("fields.end_date"),
      type: "date",
    },
    {
      name: "base_salary",
      label: t("fields.base_salary"),
      type: "number",
      min: 0,
      step: 0.01,
      required: true,
    },
  ];

  return <Create fields={fields} />;
}
