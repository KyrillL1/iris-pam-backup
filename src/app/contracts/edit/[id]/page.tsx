"use client";

import { Edit, EditFieldConfig } from "@components/edit";
import { Contract } from "@lib/fetch-contracts";
import { useFetchDepartments } from "@lib/fetch-departments";
import { useFetchEmployees } from "@lib/fetch-employees";

export default function ContractEdit() {
  const { departments } = useFetchDepartments();
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();

  const fields: EditFieldConfig[] = [
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
      mapOptionToLabel: (option: string) => {
        return departments.find((d) => d.id === option)?.name || option;
      },
      options: departments.map((d) => d.id),
      required: true,
    },
    {
      name: "job_title",
      label: "Job Title",
      required: true,
      type: "text",
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
      name: "calculation_basis",
      label: "Calculation Basis",
      type: "select",
      options: ["MONTHLY", "HOURLY"],
      required: true,
    },
    {
      name: "base_salary",
      label: "Base Salary",
      type: "number",
      min: 0,
      step: 0.01,
      required: true,
    },
  ];

  return <Edit<Contract> fields={fields} />;
}
