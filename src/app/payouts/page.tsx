"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { PayoutModelWithRelations } from "./payout.model";
import { PayslipCell } from "@components/payslip-cell";

export default function Payout() {
  const { dataGridProps } = useDataGrid<PayoutModelWithRelations>({
    meta: {
      select: `
        *,
        employee:employees(first_name, last_name)
        `
    }
  });

  const columns: GridColDef<PayoutModelWithRelations>[] = [
    {
      field: "employee_id",
      headerName: "Employee",
      minWidth: 150,
      valueGetter: (_, row) => {
        const e = row.employee;
        return e ? `${e.first_name} ${e.last_name}` : "";
      }
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
        return <>
          <PayslipCell path={params.value} />
        </>
      }
    }
  ];

  return (
    <List canCreate={false}>
      <DataTable<PayoutModelWithRelations> dataGridProps={dataGridProps} columns={columns} hideActions={[DataTableAction.DELETE, DataTableAction.EDIT, DataTableAction.SHOW]} />
    </List>
  );
}
