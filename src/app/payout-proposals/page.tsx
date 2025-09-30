"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { useStatusChip } from "./use-status-chip";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add translations
myI18n.addResourceBundle("en", "payout-proposals/list", {
    columns: {
        status: "Status",
    },
});

myI18n.addResourceBundle("pt", "payout-proposals/list", {
    columns: {
        status: "Estado",
    },
});

export default function PayoutProposals() {
    const { t } = useTranslation("payout-proposals/list");
    const { dataGridProps } = useDataGrid({});
    const { generateChip } = useStatusChip();

    const columns: GridColDef[] = [
        {
            field: "status",
            headerName: t("columns.status"),
            minWidth: 300,
            renderCell: (params) => generateChip(params.value),
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
