"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, GridColDef } from "@components/data-table";
import { ContractWithRelations } from "@lib/fetch-contracts";
import { useLocale } from "@i18n/i18n-provider";
import { useMemo } from "react";
import "./contracts.common";
import { useTranslationCommon } from "./contracts.common";

export default function ContractList() {
  const { t } = useTranslationCommon();
  const { locale } = useLocale();

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
      headerName: t("fields.employee_name"),
      minWidth: 150,
      valueGetter: (_, row) => {
        const e = row.employee;
        return e ? `${e.first_name} ${e.last_name}` : "";
      },
    },
    {
      field: "department_name",
      headerName: t("fields.department_name"),
      minWidth: 150,
      valueGetter: (_, row) => row.department?.name ?? "",
    },
    { field: "job_title", headerName: t("fields.job_title"), minWidth: 150 },
    {
      field: "contract_type",
      headerName: t("fields.contract_type"),
      minWidth: 150,
      valueGetter: (value: string) => {
        if (value === "") return value;

        return t(`options.contract_type.${value}`);
      },
    },
    {
      field: "determined",
      headerName: t("fields.determined"),
      minWidth: 100,
      type: "boolean",
    },
    {
      field: "work_percentage",
      headerName: t("fields.work_percentage"),
      minWidth: 100,
      type: "number",
    },
    {
      field: "start_date",
      headerName: t("fields.start_date"),
      minWidth: 120,
      type: "date",
    },
    {
      field: "end_date",
      headerName: t("fields.end_date"),
      minWidth: 120,
      type: "date",
    },
    {
      field: "calculation_basis",
      headerName: t("fields.calculation_basis"),
      minWidth: 120,
      valueGetter: (value: string) => {
        if (value === "") return value;

        return t(`options.calculation_basis.${value}`);
      },
    },
    {
      field: "base_salary",
      headerName: t("fields.base_salary"),
      minWidth: 120,
      type: "money",
    },
  ], [t, locale]);

  return (
    <List>
      <DataTable<ContractWithRelations>
        dataGridProps={dataGridProps}
        columns={columns}
      />
    </List>
  );
}
