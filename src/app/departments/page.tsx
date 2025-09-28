"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { Department } from "./department.model";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add i18n resources
myI18n.addResourceBundle("en", "departments/list", {
    columns: {
        name: "Name",
    },
});

myI18n.addResourceBundle("pt", "departments/list", {
    columns: {
        name: "Nome",
    },
});

export default function Departments() {
    const { t } = useTranslation("departments/list");
    const { dataGridProps } = useDataGrid<Department>({});

    const columns: GridColDef<Department>[] = [
        {
            field: "name",
            headerName: t("columns.name"),
            minWidth: 300,
        },
    ];

    return (
        <List canCreate={false}>
            <DataTable<Department>
                dataGridProps={dataGridProps}
                columns={columns}
                hideActions={[
                    DataTableAction.DELETE,
                    DataTableAction.EDIT,
                    DataTableAction.SHOW,
                ]}
            />
        </List>
    );
}
