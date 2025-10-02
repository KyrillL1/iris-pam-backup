"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { Employee } from "@lib/fetch-employees";
import { useTranslationCommon } from "./employees.common";

export default function EmployeeList() {
  const { dataGridProps } = useDataGrid<Employee>({});
  const { t } = useTranslationCommon();

  const columns: GridColDef<Employee>[] = [
    {
      field: "first_name",
      headerName: t("fields.first_name"),
      flex: 1,
      minWidth: 150,
    },
    {
      field: "last_name",
      headerName: t("fields.last_name"),
      flex: 1,
      minWidth: 150,
    },
    {
      field: "birthdate",
      headerName: t("fields.birthdate"),
      minWidth: 150,
      type: "date",
    },
    {
      field: "gender",
      headerName: t("fields.gender"),
      minWidth: 100,
      valueGetter: (value: string) => {
        if (value === "") return value;

        return t(`options.gender.${value}`);
      },
    },
    {
      field: "household_size",
      headerName: t("fields.household_size"),
      type: "number",
      minWidth: 150,
    },
    {
      field: "social_security_number",
      headerName: t("fields.social_security_number"),
      minWidth: 150,
    },
    {
      field: "quickbooks_name",
      headerName: t("fields.quickbooks_name"),
      minWidth: 150,
    },
  ];

  return (
    <List>
      <DataTable<Employee> dataGridProps={dataGridProps} columns={columns} />
    </List>
  );
}
