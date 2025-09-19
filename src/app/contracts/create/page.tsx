"use client";

import { useFetchEmployees } from "@lib/fetch-employees";
import { Create, CreateFieldConfig } from "@components/create";
import { useFetchDepartments } from "@lib/fetch-departments";

export default function ContractCreate() {
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();
  const { departments } = useFetchDepartments();

  const fields: CreateFieldConfig[] = [
    {
      name: "employee_id",
      label: "Employee",
      type: "select",
      options: employeeIds,
      mapOptionToLabel: mapEmployeeIdToName,
      required: true,
    },
    {
      name: "department_id",
      label: "Department",
      type: "select",
      options: departments.map((d) => d.id),
      mapOptionToLabel: (id) =>
        departments.find((d) => d.id === id)?.name || id,
      required: true,
    },
    {
      name: "contract_type",
      label: "Contract Type",
      type: "select",
      options: ["FREELANCER", "REGULAR", "TEMPORARY"],
      required: true,
    },
    { name: "determined", label: "Determined", type: "boolean" },
    {
      name: "calculation_basis",
      label: "Calculation Basis",
      type: "select",
      options: ["MONTHLY", "HOURLY"],
      required: true,
    },
    {
      name: "work_percentage",
      label: "Work Percentage",
      type: "number",
      min: 0,
      max: 100,
      required: true,
    },
    { name: "start_date", label: "Start Date", type: "date", required: true },
    { name: "end_date", label: "End Date", type: "date" },
    {
      name: "base_salary",
      label: "Base Salary",
      type: "number",
      min: 0,
      step: 0.01,
      required: true,
    },
  ];

  return <Create fields={fields} />;
}
