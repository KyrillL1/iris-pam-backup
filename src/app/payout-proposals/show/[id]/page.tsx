"use client";

import { PayoutProposal } from "@app/payout-proposals/payout-proposal-model";
import { Card, CardContent, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useShow } from "@refinedev/core";
import { useMemo } from "react";

export default function PayoutProposalShow() {
  const { query } = useShow<PayoutProposal>({
    meta: { select: `*, items:payout_proposal_items(*)` },
  });
  const { data, isLoading } = query;

  const record = data?.data;

  const columns: GridColDef[] = [
    { field: "employee_name", headerName: "Employee Name", minWidth: 150 },
  ];

  // Safe row computation
  const rows = record ? [{ employee_name: "Tom", id: "1" }] : [];

  return (
    <Card>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5">
          Payout Proposal {record?.id}
        </Typography>
      </CardContent>

      <DataGrid columns={columns} rows={rows} loading={isLoading} />
    </Card>
  );
}
