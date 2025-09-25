import { DataGrid, GridColDef, useGridApiRef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetchMissingWorkedHours } from "./use-fetch-missing-worked-hours";
import { useNotification } from "@refinedev/core";
import { Stack, Typography } from "@mui/material";
import { usePayoutProposalProvider } from "../payout-proposal.provider";

export interface PayoutProposalCreateRow {
    employee_id: string;
    employee_name: string;
    id: string; // contract_id
    hours_worked: number | undefined;
}

export function useHoursStep() {
    const columns: GridColDef[] = useMemo(() => [{
        field: "employee_id",
        headerName: "Employee Id",
        minWidth: 150,
        flex: 1,
    }, {
        field: "employee_name",
        headerName: "Employee Name",
        minWidth: 150,
        flex: 1,
    }, {
        field: "hours_worked",
        headerName: "Hours Worked",
        minWidth: 150,
        flex: 1,
        editable: true,
        type: "number",
    }], []);

    const { selectedContracts: includeContractIds } =
        usePayoutProposalProvider();

    const { missingWorkedHours, missingWorkedHoursError, loading } =
        useFetchMissingWorkedHours(includeContractIds);

    const { open } = useNotification();

    useEffect(() => {
        if (!missingWorkedHoursError) {
            return;
        }
        console.error(missingWorkedHoursError);
        open?.({
            message: `${missingWorkedHoursError.message}`,
            type: "error",
        });
    }, [missingWorkedHoursError]);

    const [rows, setRows] = useState<PayoutProposalCreateRow[]>([]);

    // Populate rows once data is fetched
    useEffect(() => {
        if (!missingWorkedHours) return;

        setRows(
            missingWorkedHours.map((entry) => ({
                employee_id: entry.employee_id,
                employee_name: entry.employee_name,
                hours_worked: undefined,
                id: entry.contract_id,
            })),
        );
    }, [missingWorkedHours]);

    const handleProcessRowUpdate = useCallback(
        (newRow: PayoutProposalCreateRow, oldRow: PayoutProposalCreateRow) => {
            setRows((prev) => {
                const newRows = prev.map((
                    row,
                ) => (row.id === oldRow.id ? newRow : row));
                return newRows;
            });
            return newRow;
        },
        [],
    );

    const rowsRef = useRef<any[]>([]);
    rowsRef.current = rows;
    const { setHourRows, hourRows } = usePayoutProposalProvider();

    const handleCompleteHoursStep = () => {
        console.log({ hours: rowsRef.current });
        setHourRows?.(rowsRef.current.map((r) => {
            return {
                contractId: r.id,
                workedHours: r.hours_worked || -1,
            };
        }));
    };

    const hoursView = useMemo(() => {
        return (
            <Stack gap={2}>
                <Stack gap={1}>
                    <Typography variant="h5">Worked Hours</Typography>
                    <Typography variant="body2">
                        Once you specified which employees, you can select hours
                        for "HOURLY" workers here.
                    </Typography>
                </Stack>

                <DataGrid
                    columns={columns}
                    rows={rows}
                    processRowUpdate={handleProcessRowUpdate}
                    loading={loading}
                />
            </Stack>
        );
    }, [columns, rows, missingWorkedHours]);

    return {
        hoursView,
        handleCompleteHoursStep,
    };
}
