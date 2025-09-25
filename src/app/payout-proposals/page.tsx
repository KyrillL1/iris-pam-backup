"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { useStatusChip } from "./use-status-chip";

export default function PayoutProposals() {
    const { dataGridProps } = useDataGrid({});

    const { generateChip } = useStatusChip();

    const columns: GridColDef[] = [
        {
            field: "status",
            headerName: "Status",
            minWidth: 300,
            renderCell: (params) => {
                return generateChip(params.value);
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
