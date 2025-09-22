"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { PayslipCell } from "@components/payslip-cell";
import { PayoutModel } from "./payout.model";

export default function Payout() {
  const { dataGridProps } = useDataGrid<PayoutModel>({
    meta: {
      select: `
        *,
        contract:contracts(id, employee(first_name, last_name))
        `,
    },
  });

  const columns: GridColDef<PayoutModel>[] = [
    {
      field: "contract_id",
      headerName: "Employee + Contract",
      minWidth: 150,
      valueGetter: (_, row) => {
        const e = row;
        // TODO
        return "MISSING";
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
      <DataTable<PayoutModel>
        dataGridProps={dataGridProps}
        columns={columns}
        hideActions={[
          DataTableAction.DELETE,
          DataTableAction.EDIT,
          DataTableAction.SHOW,
        ]}
      />
    </List>
  );
}
