"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { PayAdjustmentsToEmployeesWithRelations } from "@lib/fetch-pay-adjustments";
import { useMemo } from "react";
import { useTranslationCommon } from "./pay-adjustments.common";

export default function PayAdjustmentsToEmployees() {
    const { t } = useTranslationCommon();

    const { dataGridProps } = useDataGrid<
        PayAdjustmentsToEmployeesWithRelations
    >({
        meta: {
            select: `
        *,
        employee:employees(first_name, last_name),
        pay_adjustment:pay_adjustments(id, is_credit, name)
      `,
        },
    });

    const columns: GridColDef<PayAdjustmentsToEmployeesWithRelations>[] =
        useMemo(() => [
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
                field: "pay_adjustment_id",
                headerName: t("fields.pay_adjustment_id"),
                minWidth: 150,
                type: "string",
                valueGetter: (id: string, row) => {
                    return t(`payAdjustmentNames.${row.pay_adjustment?.name}`);
                },
                renderCell: (params) => (
                    <Chip
                        label={params.value}
                        color={params.row.pay_adjustment?.is_credit
                            ? "success"
                            : "error"}
                    />
                ),
            },
            {
                field: "comment",
                headerName: t("fields.comment"),
                minWidth: 150,
                type: "string",
            },
            {
                field: "user_input",
                headerName: t("fields.user_input"),
                minWidth: 150,
                type: "number",
            },
            {
                field: "start_date",
                headerName: t("fields.start_date"),
                minWidth: 150,
                type: "date",
            },
            {
                field: "end_date",
                headerName: t("fields.end_date"),
                minWidth: 150,
                type: "date",
            },
        ], [t]);

    return (
        <List>
            <DataTable<PayAdjustmentsToEmployeesWithRelations>
                dataGridProps={dataGridProps}
                columns={columns}
            />
        </List>
    );
}
