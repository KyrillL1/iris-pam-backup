"use client";

import React, { useEffect } from "react";
import {
    DataGrid,
    type GridColDef as MuiGridColDef,
    GridRenderCellParams,
    GridValidRowModel,
    GridValueFormatter,
    useGridApiRef,
} from "@mui/x-data-grid";
import { Box, Chip, IconButton } from "@mui/material";
import { DeleteButton, EditButton, ShowButton } from "@refinedev/mui";
import { ContentCopy } from "@mui/icons-material";
import { useNotification, useResourceParams } from "@refinedev/core";
import { truncateId } from "@utils/truncate-id";
import { useSelectMultipleContext } from "@contexts/select-multiple";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

export type GridColDef<T extends GridValidRowModel> =
    & Omit<MuiGridColDef<T>, "type">
    & {
        type?: MuiGridColDef<T>["type"] | "money";
    };

interface DataTableProps<T extends GridValidRowModel> {
    dataGridProps: any;
    columns: GridColDef<T>[];
    truncateId?: (id: string) => string;
    hideActions?: DataTableAction[];
    hideActionCell?: boolean;
}

export enum DataTableAction {
    EDIT = "EDIT",
    SHOW = "SHOW",
    DELETE = "DELETE",
}

// Add i18n resource bundle for table headers
myI18n.addResourceBundle("en", "datatable", {
    headers: {
        id: "ID",
        created_at: "Created At",
        updated_at: "Updated At",
        actions: "Actions",
    },
    notifications: {
        copyId: "Copied ID: {{id}}",
    },
});

myI18n.addResourceBundle("pt", "datatable", {
    headers: {
        id: "ID",
        created_at: "Criado em",
        updated_at: "Atualizado em",
        actions: "Ações",
    },
    notifications: {
        copyId: "ID copiado: {{id}}",
    },
});

export function DataTable<T extends { id: string }>(
    { dataGridProps, columns, hideActions = [], hideActionCell = false }:
        DataTableProps<T>,
) {
    const { open } = useNotification();
    const { showMultiple, setSelected, clearSelected } =
        useSelectMultipleContext();
    const { resource } = useResourceParams();
    const { t } = useTranslation("datatable");
    const apiRef = useGridApiRef();

    const handleCopyIdClick = (id: string) => {
        navigator.clipboard.writeText(id);
        open?.({
            type: "success",
            message: "",
            description: t("notifications.copyId", { id }),
        });
    };

    const enhancedColumns = React.useMemo<GridColDef<T>[]>(() => {
        const updatedColumns = columns.map((col) => {
            if (col.type === "date" || col.type === "dateTime") {
                return {
                    ...col,
                    valueGetter: (v: any) => (v ? new Date(v) : null),
                } as MuiGridColDef;
            }
            if (col.type === "money") {
                const valueFormatter: GridValueFormatter<T> = (value) =>
                    new Intl.NumberFormat("pt-MZ", {
                        style: "currency",
                        currency: "MZN",
                    }).format(value ?? 0);
                return { ...col, valueFormatter };
            }
            return col;
        });

        const standardColumns: GridColDef<T>[] = [
            {
                field: "id",
                headerName: t("headers.id"),
                type: "string",
                minWidth: 120,
                renderCell: (params: GridRenderCellParams<T>) => (
                    <>
                        <Chip
                            label={truncateId(params.value as string)}
                            size="small"
                        />
                        <IconButton
                            size="small"
                            onClick={() =>
                                handleCopyIdClick(params.value as string)}
                        >
                            <ContentCopy fontSize="inherit" />
                        </IconButton>
                    </>
                ),
            },
            {
                field: "created_at",
                headerName: t("headers.created_at"),
                type: "dateTime",
                minWidth: 180,
                valueGetter: (v: any) => (v ? new Date(v) : null),
            },
            {
                field: "updated_at",
                headerName: t("headers.updated_at"),
                type: "dateTime",
                minWidth: 180,
                valueGetter: (v: any) => (v ? new Date(v) : null),
            },
        ];

        const showEdit = !hideActions.includes(DataTableAction.EDIT);
        const showShow = !hideActions.includes(DataTableAction.SHOW);
        const showDelete = !hideActions.includes(DataTableAction.DELETE) &&
            resource?.meta?.canDelete;
        const showActionCell = !hideActionCell &&
            (showEdit || showShow || showDelete);

        if (showActionCell) {
            standardColumns.push({
                field: "actions",
                headerName: t("headers.actions"),
                align: "right",
                headerAlign: "right",
                minWidth: 150,
                sortable: false,
                filterable: false,
                renderCell: ({ row }: GridRenderCellParams<T>) => (
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                        {showEdit && (
                            <EditButton hideText recordItemId={row.id} />
                        )}
                        {showShow && (
                            <ShowButton hideText recordItemId={row.id} />
                        )}
                        {showDelete && (
                            <DeleteButton hideText recordItemId={row.id} />
                        )}
                    </Box>
                ),
            });
        }

        return [...updatedColumns, ...standardColumns];
    }, [columns, showMultiple, t, hideActions, hideActionCell, resource]);

    useEffect(() => {
        clearSelected?.();
        apiRef.current.setRowSelectionModel([]);
    }, [showMultiple]);

    return (
        <DataGrid
            {...dataGridProps}
            columns={enhancedColumns}
            checkboxSelection={showMultiple}
            apiRef={apiRef}
            onRowSelectionModelChange={(selectedIds, details) => {
                setSelected?.((selectedIds as string[]).map((id) => ({
                    key: id,
                    value: details.api.getRow(id),
                })));
            }}
        />
    );
}
