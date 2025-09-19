"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";

export default function PayoutProposals() {
    const { dataGridProps } = useDataGrid({});

    const columns: GridColDef[] = [
        {
            field: "status",
            headerName: "Status",
            minWidth: 300,
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
