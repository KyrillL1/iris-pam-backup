"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { Employee } from "@lib/fetch-employees";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "employees/list", {
  columns: {
    first_name: "First Name",
    last_name: "Last Name",
    birthdate: "Birthdate",
    gender: "Gender",
    household_size: "Household Size",
    social_security_number: "SSN",
    quickbooks_name: "QuickBooks Name",
  },
});

myI18n.addResourceBundle("pt", "employees/list", {
  columns: {
    first_name: "Primeiro Nome",
    last_name: "Sobrenome",
    birthdate: "Data de Nascimento",
    gender: "Gênero",
    household_size: "# de Pessoas no Lar",
    social_security_number: "# Seguranca Social",
    quickbooks_name: "QuickBooks Nome",
  },
});

export default function EmployeeList() {
  const { dataGridProps } = useDataGrid<Employee>({});
  const { t } = useTranslation("employees/list");

  const columns: GridColDef<Employee>[] = [
    {
      field: "first_name",
      headerName: t("columns.first_name"),
      flex: 1,
      minWidth: 150,
    },
    {
      field: "last_name",
      headerName: t("columns.last_name"),
      flex: 1,
      minWidth: 150,
    },
    {
      field: "birthdate",
      headerName: t("columns.birthdate"),
      minWidth: 150,
      type: "date",
    },
    { field: "gender", headerName: t("columns.gender"), minWidth: 100 },
    {
      field: "household_size",
      headerName: t("columns.household_size"),
      type: "number",
      minWidth: 150,
    },
    {
      field: "social_security_number",
      headerName: t("columns.social_security_number"),
      minWidth: 150,
    },
    {
      field: "quickbooks_name",
      headerName: t("columns.quickbooks_name"),
      minWidth: 150,
    },
  ];

  return (
    <List>
      <DataTable<Employee> dataGridProps={dataGridProps} columns={columns} />
    </List>
  );
}
