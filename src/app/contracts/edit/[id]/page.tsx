"use client";

import { useTranslationCommon } from "../../contracts.common";
import { Edit, EditFieldConfig } from "@components/edit";
import { Contract } from "@lib/fetch-contracts";
import { useFetchDepartments } from "@lib/fetch-departments";
import { useFetchEmployees } from "@lib/fetch-employees";

export default function ContractEdit() {
  const { t } = useTranslationCommon();

  const { departments, loading } = useFetchDepartments();
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();

  const fields: EditFieldConfig[] = [
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
      mapOptionToLabel: (option: string) => {
        return departments.find((d) => d.id === option)?.name || option;
      },
      options: departments.map((d) => d.id),
      required: true,
    },
    {
      name: "job_title",
      label: t("fields.job_title"),
      required: true,
      type: "text",
    },
    {
      name: "contract_type",
      label: t("fields.contract_type"),
      type: "select",
      options: ["FREELANCER", "REGULAR", "TEMPORARY"],
      required: true,
      mapOptionToLabel: (option: string) =>
        t(`options.contract_type.${option}`),
    },
    {
      name: "determined",
      label: t("fields.determined"),
      type: "boolean",
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
      name: "calculation_basis",
      label: t("fields.calculation_basis"),
      type: "select",
      options: ["MONTHLY", "HOURLY"],
      required: true,
      mapOptionToLabel: (option: string) =>
        t(`options.calculation_basis.${option}`),
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

  return <Edit<Contract> fields={fields} isLoading={loading}/>;
}
