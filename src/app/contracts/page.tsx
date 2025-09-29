"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, GridColDef } from "@components/data-table";
import { ContractWithRelations } from "@lib/fetch-contracts";
import { myI18n, useTranslation } from "@i18n/i18n-provider";
import { useCallback, useMemo } from "react";

myI18n.addResourceBundle("en", "contracts/list", {
  columns: {
    employee_name: "Employee",
    department_name: "Department",
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

myI18n.addResourceBundle("pt", "contracts/list", {
  columns: {
    employee_name: "Funcionário",
    department_name: "Departamento",
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

export default function ContractList() {
  const { t } = useTranslation("contracts/list");

  const { dataGridProps } = useDataGrid<ContractWithRelations>({
    meta: {
      select: `
        *,
        department:departments(name),
        employee:employees(first_name, last_name)
      `,
    },
  });

  const columns: GridColDef<ContractWithRelations>[] = useMemo(() => [
    {
      field: "employee_name",
      headerName: t("columns.employee_name"),
      minWidth: 150,
      valueGetter: (_, row) => {
        const e = row.employee;
        return e ? `${e.first_name} ${e.last_name}` : "";
      },
    },
    {
      field: "department_name",
      headerName: t("columns.department_name"),
      minWidth: 150,
      valueGetter: (_, row) => row.department?.name ?? "",
    },
    { field: "job_title", headerName: t("columns.job_title"), minWidth: 150 },
    {
      field: "contract_type",
      headerName: t("columns.contract_type"),
      minWidth: 150,
    },
    {
      field: "determined",
      headerName: t("columns.determined"),
      minWidth: 100,
      type: "boolean",
    },
    {
      field: "work_percentage",
      headerName: t("columns.work_percentage"),
      minWidth: 100,
      type: "number",
    },
    {
      field: "start_date",
      headerName: t("columns.start_date"),
      minWidth: 120,
      type: "date",
    },
    {
      field: "end_date",
      headerName: t("columns.end_date"),
      minWidth: 120,
      type: "date",
    },
    {
      field: "calculation_basis",
      headerName: t("columns.calculation_basis"),
      minWidth: 120,
    },
    {
      field: "base_salary",
      headerName: t("columns.base_salary"),
      minWidth: 120,
      type: "money",
    },
  ], [t]);

  return (
    <List>
      <DataTable<ContractWithRelations>
        dataGridProps={dataGridProps}
        columns={columns}
      />
    </List>
  );
}
