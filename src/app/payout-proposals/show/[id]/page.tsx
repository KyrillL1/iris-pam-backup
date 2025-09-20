"use client";

import { PayoutProposal } from "@app/payout-proposals/payout-proposal-model";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useShow } from "@refinedev/core";
import { useMemo } from "react";
import { usePayoutProposalShowColumns } from "./use-payout-proposal-show-columns";
import { useStatusChip } from "./use-status-chip";
import { truncateId } from "@utils/truncate-id";

export default function PayoutProposalShow() {
  const { query } = useShow<PayoutProposal>({
    meta: { select: `*, items:payout_proposal_items(*)` },
  });
  const { data, isLoading } = query;

  const record = data?.data;

  const { columnGroupingModel, columns } = usePayoutProposalShowColumns();

  // Safe row computation
  const rows = useMemo(
    () => {
      if (!record) return undefined;
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
    [record],
  );

  const { chip } = useStatusChip(record?.status);

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

          {record && (
            <Typography sx={{ color: "text.secondary", paddingLeft: 2 }}>
              #{truncateId(record.id, 10)}
            </Typography>
          )}
        </Box>
      </CardContent>

      <DataGrid
        columns={columns}
        columnGroupingModel={columnGroupingModel}
        rows={rows}
        loading={isLoading}
      />
    </Card>
  );
}
