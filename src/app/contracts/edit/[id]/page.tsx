"use client";

import { Edit, EditFieldConfig } from "@components/edit";
import { Contract } from "@lib/fetch-contracts";
import { useFetchDepartments } from "@lib/fetch-departments";
import { useFetchEmployees } from "@lib/fetch-employees";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "contracts/edit", {
  fields: {
    employee_id: "Employee",
    department_id: "Department",
    job_title: "Job Title",
    contract_type: "Contract Type",
    determined: "Determined",
    work_percentage: "Work Percentage",
    start_date: "Start Date",
    end_date: "End Date",
    calculation_basis: "Calculation Basis",
    base_salary: "Base Salary",
  },
  options: {
    contract_type: {
      FREELANCER: "Freelancer",
      REGULAR: "Regular",
      TEMPORARY: "Temporary",
    },
    calculation_basis: {
      MONTHLY: "Monthly",
      HOURLY: "Hourly",
    },
  },
});

myI18n.addResourceBundle("pt", "contracts/edit", {
  fields: {
    employee_id: "Funcionário",
    department_id: "Departamento",
    job_title: "Cargo",
    contract_type: "Tipo de Contrato",
    determined: "Determinada",
    work_percentage: "Percentagem de Trabalho",
    start_date: "Data Início",
    end_date: "Data Fim",
    calculation_basis: "Base de Cálculo",
    base_salary: "Salário Base",
  },
  options: {
    contract_type: {
      FREELANCER: "Freelancer",
      REGULAR: "Regular",
      TEMPORARY: "Temporário",
    },
    calculation_basis: {
      MONTHLY: "Mensal",
      HOURLY: "Horária",
    },
  },
});

export default function ContractEdit() {
  const { t } = useTranslation("contracts/edit");

  const { departments } = useFetchDepartments();
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();

  const fields: EditFieldConfig[] = [
    {
      name: "employee_id",
      label: t("fields.employee_id"),
      type: "select",
      options: employeeIds,
      mapOptionToLabel: mapEmployeeIdToName,
      required: true,
    },
    {
      name: "department_id",
      label: t("fields.department_id"),
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

  return <Edit<Contract> fields={fields} />;
}
