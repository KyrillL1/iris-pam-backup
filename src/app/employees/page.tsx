"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { Employee } from "@lib/fetch-employees";
import { useState } from "react";

export default function EmployeeList() {
  const [blob, setBlob] = useState<Blob>();
  const { dataGridProps } = useDataGrid<Employee>({});

  const columns: GridColDef<Employee>[] = [
    { field: "first_name", headerName: "First Name", flex: 1, minWidth: 150 },
    { field: "last_name", headerName: "Last Name", flex: 1, minWidth: 150 },
    {
      field: "birthdate",
      headerName: "Birthdate",
      minWidth: 120,
      type: "date",
    },
    { field: "gender", headerName: "Gender", minWidth: 100 },
    {
      field: "household_size",
      headerName: "Household Size",
      type: "number",
      minWidth: 120,
    },
    { field: "social_security_number", headerName: "SSN", minWidth: 150 },
    { field: "quickbooks_name", headerName: "QuickBooks Name", minWidth: 150 },
  ];

  return (
    <List>
      <DataTable<Employee> dataGridProps={dataGridProps} columns={columns} />
    </List>
  );
}
