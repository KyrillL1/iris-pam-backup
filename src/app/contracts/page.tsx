"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, GridColDef } from "@components/data-table";
import { ContractWithRelations } from "@lib/fetch-contracts";

export default function ContractList() {
  const { dataGridProps } = useDataGrid<ContractWithRelations>({
    meta: {
      select: `
        *,
        department:departments(name),
        employee:employees(first_name, last_name)
      `,
    },
  });

  const columns: GridColDef<ContractWithRelations>[] = [
    {
      field: "employee_name",
      headerName: "Employee",
      minWidth: 150,
      valueGetter: (_, row) => {
        const e = row.employee;
        return e ? `${e.first_name} ${e.last_name}` : "";
      },
    },
    {
      field: "department_name",
      headerName: "Department",
      minWidth: 150,
      valueGetter: (_, row) => row.department?.name ?? "",
    },
    {
      field: "job_title",
      headerName: "Job Title",
      minWidth: 150,
    },
    {
      field: "contract_type",
      headerName: "Contract Type",
      minWidth: 120,
    },
    {
      field: "determined",
      headerName: "Determined",
      minWidth: 100,
      type: "boolean",
    },
    {
      field: "work_percentage",
      headerName: "Work %",
      minWidth: 100,
      type: "number",
    },
    {
      field: "start_date",
      headerName: "Start Date",
      minWidth: 120,
      type: "date",
    },
    {
      field: "end_date",
      headerName: "End Date",
      minWidth: 120,
      type: "date",
    },
    {
      field: "calculation_basis",
      headerName: "Calculation",
      minWidth: 120,
    },
    {
      field: "base_salary",
      headerName: "Base Salary",
      minWidth: 120,
      type: "money",
    },
  ];

  return (
    <List>
      <DataTable<ContractWithRelations>
        dataGridProps={dataGridProps}
        columns={columns}
      />
    </List>
  );
}
