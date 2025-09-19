"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { Department } from "./department.model";

export default function Departments() {
    const { dataGridProps } = useDataGrid<Department>({
    });

    const columns: GridColDef<Department>[] = [
        {
            field: "name",
            headerName: "Name",
            minWidth: 300,
        },
    ];

    return (
        <List canCreate={false}>
            <DataTable<Department>
                dataGridProps={dataGridProps}
                columns={columns}
                hideActions={[DataTableAction.DELETE, DataTableAction.EDIT, DataTableAction.SHOW]}
            />
        </List>
    );
}
