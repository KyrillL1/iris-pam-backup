"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { PayslipCell } from "@components/payslip-cell";
import { PayoutModel, PayoutModelWithRelations } from "./payout.model";

export default function Payout() {
  const { dataGridProps } = useDataGrid<PayoutModelWithRelations>({
    meta: {
      select: `
        *,
        payout_proposal_item:payout_proposal_items(
          contract_job_title,
          employee_id, 
          employee:employees(
            first_name,
            last_name
          )
        )
        `,
    },
  });

  const columns: GridColDef<PayoutModelWithRelations>[] = [
    {
      field: "contract_id",
      headerName: "Employee + Contract",
      minWidth: 200,
      valueGetter: (_, row) => {
        const employeeName =
          `${row.payout_proposal_item?.employee?.first_name} ${row.payout_proposal_item?.employee?.last_name}`;
        const jobTitle = row.payout_proposal_item?.contract_job_title;
        return `${employeeName} (${jobTitle}) `;
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 150,
      type: "number",
    },
    {
      field: "payout_slip_path",
      headerName: "Payout Slip",
      minWidth: 150,
      type: "string",
      renderCell: (params) => {
        return (
          <>
            <PayslipCell path={params.value} />
          </>
        );
      },
    },
  ];

  return (
    <List canCreate={false}>
      <DataTable<PayoutModelWithRelations>
        dataGridProps={dataGridProps}
        columns={columns}
        hideActions={[
          DataTableAction.DELETE,
        ]}
      />
    </List>
  );
}
