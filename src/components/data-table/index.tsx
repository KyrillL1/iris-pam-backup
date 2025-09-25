"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    DataGrid,
    type GridColDef as MuiGridColDef,
    GridFooter,
    GridRenderCellParams,
    GridRowModel,
    GridValidRowModel,
    GridValueFormatter,
    useGridApiRef,
} from "@mui/x-data-grid";
import {
    Box,
    Checkbox,
    Chip,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import {
    DeleteButton,
    EditButton,
    ShowButton,
    useDataGrid,
} from "@refinedev/mui";
import { CheckBoxOutlineBlank, ContentCopy } from "@mui/icons-material";
import { useNotification, useResourceParams, useSelect } from "@refinedev/core";
import { truncateId } from "@utils/truncate-id";
import { useSelectMultipleContext } from "@contexts/select-multiple";

export type GridColDef<T extends GridValidRowModel> =
    & Omit<MuiGridColDef<T>, "type">
    & {
        type?: MuiGridColDef<T>["type"] | "money";
    };

interface DataTableProps<T extends GridValidRowModel> {
    dataGridProps: any; // or refine's DataGridProps type
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

export function DataTable<T extends { id: string }>(
    { dataGridProps, columns, hideActions = [], hideActionCell = false }:
        DataTableProps<T>,
) {
    const { open } = useNotification();

    const handleCopyIdClick = (id: string) => {
        navigator.clipboard.writeText(id);
        open?.({
            type: "success",
            message: "",
            description: `Copied ID: ${id}`,
        });
    };

    const { showMultiple, setSelected, clearSelected } =
        useSelectMultipleContext();

    const { resource } = useResourceParams();

    // Wrap original columns to add ID copy button if needed
    const enhancedColumns = React.useMemo<GridColDef<T>[]>(() => {
        const updatedColumns = columns.map((col) => {
            if (col.type === "date" || col.type === "dateTime") {
                return {
                    ...col,
                    valueGetter: (v: any) => (v ? new Date(v) : null),
                } as MuiGridColDef;
            }
            if (col.type === "money") {
                const valueFormatter: GridValueFormatter<T> = (value) => {
                    return new Intl.NumberFormat("pt-MZ", {
                        style: "currency",
                        currency: "MZN",
                    }).format(value ?? 0);
                };
                return {
                    ...col,
                    valueFormatter,
                };
            }
            return col;
        });

        const standardColumns: GridColDef<T>[] = [
            {
                field: "id",
                headerName: "ID",
                type: "string",
                minWidth: 120,
                renderCell: (params) => {
                    return (
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
                    );
                },
            },
            {
                field: "created_at",
                headerName: "Created At",
                type: "dateTime",
                minWidth: 180,
                valueGetter: (v: any) => (v ? new Date(v) : null),
            },
            {
                field: "updated_at",
                headerName: "Updated At",
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
                headerName: "Actions",
                align: "right",
                headerAlign: "right",
                minWidth: 150,
                sortable: false,
                filterable: false,
                renderCell: ({ row }: GridRenderCellParams<T>) => {
                    return (
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
                    );
                },
            });
        }

        return [...updatedColumns, ...standardColumns];
    }, [columns, showMultiple]);

    const apiRef = useGridApiRef();
    useEffect(() => {
        // whenever it changes, make sure to reset your selection
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
                setSelected?.((selectedIds as string[]).map((id) => {
                    return {
                        key: id,
                        value: details.api.getRow(id),
                    };
                }));
            }}
        />
    );
}
