"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { PayAdjustmentsToEmployeesWithRelations } from "@lib/fetch-pay-adjustments";
import { myI18n, useTranslation } from "@i18n/i18n-provider";
import { useMemo } from "react";

// Add translation bundles
myI18n.addResourceBundle("en", "pay-adjustments-to-employees/list", {
    title: "Benefits & Deductions",
    columns: {
        employee_name: "Employee",
        pay_adjustment_id: "Benefit / Deduction Name",
        comment: "Comment",
        user_input: "User Input",
        start_date: "Start Date",
        end_date: "End Date",
    },
});

myI18n.addResourceBundle("pt", "pay-adjustments-to-employees/list", {
    title: "Benefícios & Descontos",
    columns: {
        employee_name: "Funcionário",
        pay_adjustment_id: "Benefício / Desconto",
        comment: "Comentário",
        user_input: "Entrada do Usuário",
        start_date: "Data Início",
        end_date: "Data Fim",
    },
});

export default function PayAdjustmentsToEmployees() {
    const { t } = useTranslation("pay-adjustments-to-employees/list");

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
                headerName: t("columns.employee_name"),
                minWidth: 150,
                valueGetter: (_, row) => {
                    const e = row.employee;
                    return e ? `${e.first_name} ${e.last_name}` : "";
                },
            },
            {
                field: "pay_adjustment_id",
                headerName: t("columns.pay_adjustment_id"),
                minWidth: 150,
                type: "string",
                valueGetter: (_, entry) => entry.pay_adjustment?.name,
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
                headerName: t("columns.comment"),
                minWidth: 150,
                type: "string",
            },
            {
                field: "user_input",
                headerName: t("columns.user_input"),
                minWidth: 150,
                type: "number",
            },
            {
                field: "start_date",
                headerName: t("columns.start_date"),
                minWidth: 150,
                type: "date",
            },
            {
                field: "end_date",
                headerName: t("columns.end_date"),
                minWidth: 150,
                type: "date",
            },
        ], []);

    return (
        <List title={t("title")}>
            <DataTable<PayAdjustmentsToEmployeesWithRelations>
                dataGridProps={dataGridProps}
                columns={columns}
            />
        </List>
    );
}
