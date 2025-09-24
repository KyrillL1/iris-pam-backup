"use client";

import React, { useState } from "react";
import {
    DataGrid,
    type GridColDef as MuiGridColDef,
    GridFooter,
    GridRenderCellParams,
    GridRowModel,
    GridValidRowModel,
    GridValueFormatter,
} from "@mui/x-data-grid";
import {
    Box,
    Checkbox,
    Chip,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { DeleteButton, EditButton, ShowButton } from "@refinedev/mui";
import { CheckBoxOutlineBlank, ContentCopy } from "@mui/icons-material";
import { useNotification, useSelect } from "@refinedev/core";
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

    const { showMultiple, addSelected, removeSelected, selected } =
        useSelectMultipleContext();

    // Wrap original columns to add ID copy button if needed
    const enhancedColumns = React.useMemo<GridColDef<T>[]>(() => {
        const actionColumns: GridColDef<T>[] = [];
        if (showMultiple) {
            actionColumns.push({
                field: "select_column",
                renderHeader: () => <CheckBoxOutlineBlank />,
                headerAlign: "center",
                type: "custom",
                renderCell: (params) => {
                    const id = params.row.id;
                    const row = params.row;
                    return (
                        <Stack justifyContent={"center"}>
                            <Checkbox
                                onChange={(e) => {
                                    const nowChecked = e.target.checked;
                                    if (nowChecked) {
                                        addSelected?.(id, row);
                                        return;
                                    }

                                    removeSelected?.(id);
                                }}
                            />
                        </Stack>
                    );
                },
                disableColumnMenu: true,
                filterable: false,
                sortable: false,
                hideable: false,
            });
        }

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
        const showDelete = !hideActions.includes(DataTableAction.DELETE);
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

        return [...actionColumns, ...updatedColumns, ...standardColumns];
    }, [columns, showMultiple]);

    return (
        <DataGrid
            {...dataGridProps}
            columns={enhancedColumns}
            slots={{
                footer: () => {
                    return (
                        <Stack
                            flexDirection={"row"}
                        >
                            {showMultiple && (
                                <Typography
                                    variant="body2"
                                    component={"span"}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        paddingLeft: 2,
                                        borderTop: (t) =>
                                            `1px solid ${t.palette.divider}`,
                                    }}
                                >
                                    Selected: {selected?.length}
                                </Typography>
                            )}
                            <GridFooter sx={{ flexGrow: 1 }} />
                        </Stack>
                    );
                },
            }}
        />
    );
}
