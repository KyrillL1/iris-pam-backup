"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { useStatusChip } from "./use-status-chip";
import { useTranslationCommon } from "./payout-proposal.common";

export default function PayoutProposals() {
    const { t } = useTranslationCommon();
    const { dataGridProps } = useDataGrid({});
    const { generateChip } = useStatusChip();

    const columns: GridColDef[] = [
        {
            field: "status",
            headerName: t("fields.status"),
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
