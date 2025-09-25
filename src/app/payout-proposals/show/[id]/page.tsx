"use client";

import { PayoutProposal } from "@app/payout-proposals/payout-proposal-model";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  useGo,
  useNavigation,
  useNotification,
  useShow,
} from "@refinedev/core";
import { useEffect, useMemo, useState } from "react";
import { usePayoutProposalShowColumns } from "./use-payout-proposal-show-columns";
import { useStatusChip } from "../../use-status-chip";
import { truncateId } from "@utils/truncate-id";
import { useButtonRow } from "./use-button-row";
import { DeleteButton, ListButton } from "@refinedev/mui";
import { usePayslipFetching } from "./use-payslip-fetching";

export default function PayoutProposalShow() {
  const { query } = useShow<PayoutProposal>({
    meta: { select: `*, items:payout_proposal_items(*)` },
  });
  const { open } = useNotification();
  const { data, isLoading } = query;
  const { list } = useNavigation();

  const record = data?.data;

  const { columnGroupingModel, columns } = usePayoutProposalShowColumns(
    record?.items,
  );

  // Safe row computation
  const rows = useMemo(
    () => {
      if (!record?.items) return undefined;
      return record?.items.map((item) => {
        return {
          ...item,
          id: item.id,
          item_id: truncateId(item.id, 9),
          created_at: new Date(item.created_at),
          updated_at: new Date(item.created_at),
        };
      });
    },
    [record?.items],
  );

  const { finalRows: payslipEnrichedRows, payslipFetchingError } =
    usePayslipFetching(rows);
  useEffect(() => {
    if (!payslipFetchingError) return;

    const message = payslipFetchingError.message;
    open?.({ message, type: "error" });
  }, [payslipFetchingError]);

  const { chip } = useStatusChip(record?.status);
  const { buttonRow } = useButtonRow(record, payslipEnrichedRows);

  return (
    <Card>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Typography variant="h5">
              Payout Proposal
            </Typography>
            {chip}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <DeleteButton
              onSuccess={() => {
                list("payout_proposals");
              }}
            />
            <ListButton />
          </Box>
        </Box>

        <DataGrid
          columns={columns}
          columnGroupingModel={columnGroupingModel}
          rows={payslipEnrichedRows || rows}
          loading={isLoading}
          sx={{
            "& .header-primary": {
              backgroundColor: (theme) => theme.palette.primary.main,
              fontWeight: "bold",
              color: "white",
            },
            "& .header-warning": {
              backgroundColor: (theme) => theme.palette.warning.main,
              fontWeight: "bold",
              color: "white",
            },
            "& .header-success": {
              backgroundColor: (theme) => theme.palette.success.main,
              fontWeight: "bold",
              color: "white",
            },
            "& .header-error": {
              backgroundColor: (theme) => theme.palette.error.main,
              fontWeight: "bold",
              color: "white",
            },
          }}
        />

        {buttonRow}
      </CardContent>
    </Card>
  );
}
