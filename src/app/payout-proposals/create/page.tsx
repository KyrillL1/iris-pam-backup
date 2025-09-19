"use client";

import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridCellEditStopParams,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetchMissingWorkedHours } from "./use-fetch-missing-worked-hours";
import { useNavigation, useNotification } from "@refinedev/core";
import {
  CreatePayoutProposalData,
  useCreatePayoutProposal,
} from "./use-create-payout-proposal";
import { CurrencyExchange } from "@mui/icons-material";

interface PayoutProposalCreateRow {
  employee_id: string;
  employee_name: string;
  id: string; // contract_id
  hours_worked: number | undefined;
}

export default function PayoutProposalCreate() {
  const { list } = useNavigation();

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

  const { missingWorkedHours, missingWorkedHoursError } =
    useFetchMissingWorkedHours();
  const { open } = useNotification();

  useEffect(() => {
    if (!missingWorkedHoursError) {
      return;
    }
    console.error(missingWorkedHoursError);
    open?.({ message: `${missingWorkedHoursError.message}`, type: "error" });
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
      setRows((prev) =>
        prev.map((row) => (row.id === oldRow.id ? newRow : row))
      );
      return newRow;
    },
    [],
  );

  const { createPayoutProposal, data: createPayoutResponse, error } =
    useCreatePayoutProposal();
  useEffect(() => {
    if (!error) return;
    open?.({ message: error.message, type: "error" });
  }, [error]);

  const handleCreatePayoutClick = useCallback(() => {
    const entries: CreatePayoutProposalData[] = rows.map((r) => {
      return {
        contract_id: r.id,
        hours: r.hours_worked || 0,
      };
    });

    createPayoutProposal(entries);
  }, [rows]);

  useEffect(() => {
    if (!createPayoutResponse) return;

    const payoutProposalId = createPayoutResponse.meta.id;
    open?.({
      message: `${createPayoutResponse.message}. Id: ${payoutProposalId}`,
      type: "success",
    });
    list("payout_proposals");
  }, [createPayoutResponse]);

  const buttonDisabled = useMemo(() => {
    if (!rows) return true;
    return rows.some((r) => r.hours_worked === undefined);
  }, [rows]);

  return (
    <Card>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5">
          Payout Proposals
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          First specify hours worked for HOURLY workers
        </Typography>
        <DataGrid
          columns={columns}
          rows={rows}
          processRowUpdate={handleProcessRowUpdate}
        />
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant="contained"
            onClick={handleCreatePayoutClick}
            startIcon={<CurrencyExchange />}
            disabled={buttonDisabled}
          >
            Create
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
