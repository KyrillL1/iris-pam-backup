"use client";

import { useFetchEmployees } from "@lib/fetch-employees";
import { Create, CreateFieldConfig } from "@components/create";
import { useFetchDepartments } from "@lib/fetch-departments";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add translation resources for this page
myI18n.addResourceBundle("en", "contracts/create", {
  fields: {
    employee_id: "Employee",
    department_id: "Department",
    job_title: "Job Title",
    contract_type: "Contract Type",
    determined: "Determined",
    calculation_basis: "Calculation Basis",
    work_percentage: "Work Percentage",
    start_date: "Start Date",
    end_date: "End Date",
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

myI18n.addResourceBundle("pt", "contracts/create", {
  fields: {
    employee_id: "Funcionário",
    department_id: "Departamento",
    job_title: "Cargo",
    contract_type: "Tipo de Contrato",
    determined: "Determinada",
    calculation_basis: "Base de Cálculo",
    work_percentage: "Percentagem de Trabalho",
    start_date: "Data Início",
    end_date: "Data Fim",
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

export default function ContractCreate() {
  const { t } = useTranslation("contracts/create");
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();
  const { departments } = useFetchDepartments();

  const fields: CreateFieldConfig[] = [
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
      mapOptionToLabel: (option: string) => {
        if (option === "") return "";
        return t(`options.contract_type.${option}`);
      },
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
      mapOptionToLabel: (option: string) => {
        if (option === "") return "";
        return t(`options.calculation_basis.${option}`);
      },
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
