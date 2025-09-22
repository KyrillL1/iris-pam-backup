"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { Chip } from "@mui/material";

export default function PayoutProposals() {
    const { dataGridProps } = useDataGrid({});

    const columns: GridColDef[] = [
        {
            field: "status",
            headerName: "Status",
            minWidth: 300,
            renderCell: (params) => {
                return (
                    <Chip
                        label={params.value}
                        color={params.value === "DRAFT"
                            ? "warning"
                            : params.value === "UNDER_REVIEW"
                            ? "warning"
                            : params.value === "APPROVED"
                            ? "success"
                            : params.value === "PAID_OUT"
                            ? "success"
                            : "error"}
                    />
                );
            },
        },
    ];

    return (
        <List>
            <DataTable
                dataGridProps={dataGridProps}
                columns={columns}
                hideActions={[DataTableAction.EDIT]}
            />
        </List>
    );
}
