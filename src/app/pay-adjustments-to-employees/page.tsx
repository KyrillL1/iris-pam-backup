"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { PayAdjustmentsToEmployeesWithRelations } from "@lib/fetch-pay-adjustments";

export default function PayAdjustmentsToEmployees() {
    const { dataGridProps } = useDataGrid<PayAdjustmentsToEmployeesWithRelations>({
        meta: {
            select: `
        *,
        employee:employees(first_name, last_name),
        pay_adjustment:pay_adjustments(id, is_credit, name)
        `
        }
    });

    const columns: GridColDef<PayAdjustmentsToEmployeesWithRelations>[] = [
        {
            field: "employee_name",
            headerName: "Employee",
            minWidth: 150,
            valueGetter: (_, row) => {
                const e = row.employee;
                return e ? `${e.first_name} ${e.last_name}` : "";
            }
        },
        {
            field: "pay_adjustment_id",
            headerName: "Benefit/ Deduction Name",
            minWidth: 150,
            type: "string",
            valueGetter: (_, entry: PayAdjustmentsToEmployeesWithRelations) => {
                return entry.pay_adjustment?.name;
            },
            renderCell: (params) => {
                return <Chip label={params.value} color={params.row.pay_adjustment?.is_credit ? "success" : "error"} />
            }
        },
        {
            field: "comment",
            headerName: "Comment",
            minWidth: 150,
            type: "string",
        },
        {
            field: "user_input",
            headerName: "User Input",
            minWidth: 150,
            type: "number",
        },
        {
            field: "start_date",
            headerName: "Start Date",
            minWidth: 150,
            type: "date",
        },
        {
            field: "end_date",
            headerName: "End Date",
            minWidth: 150,
            type: "date",
        }
    ];

    return (
        <List title="Benefits & Deductions">
            <DataTable<PayAdjustmentsToEmployeesWithRelations>
                dataGridProps={dataGridProps}
                columns={columns}
            />
        </List>
    );
}
