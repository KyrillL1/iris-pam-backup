"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { RecipientPayoutInformationWithRelationsModel } from "@lib/fetch-payout-information";

export default function RecipientPayoutInformation() {
  const { dataGridProps } = useDataGrid<RecipientPayoutInformationWithRelationsModel>({
    meta: {
      select: `
        *,
        employee:employees(first_name, last_name)
        `
    }
  });

  const columns: GridColDef<RecipientPayoutInformationWithRelationsModel>[] = [
    {
      field: "employee_id",
      headerName: "Employee",
      minWidth: 150,
      valueGetter: (_, row) => {
        const e = row.employee;
        return e ? `${e.first_name} ${e.last_name}` : "";
      }
    },
    { field: "recipient_name", headerName: "Recipient Name", minWidth: 150 },
    { field: "means_of_payment", headerName: "Means of Payment", minWidth: 150 },
    { field: "mpesa_number", headerName: "Mpesa Number", minWidth: 150 },
    { field: "bank_routing_number", headerName: "Bank Routing Number", minWidth: 150 },
    { field: "bank_account_number", headerName: "Bank Account Number", minWidth: 150 },
    { field: "bank_name", headerName: "Bank Name", minWidth: 150 },
  ];

  return (
    <List title="Recipient Payout Information">
      <DataTable<RecipientPayoutInformationWithRelationsModel> dataGridProps={dataGridProps} columns={columns} />
    </List>
  );
}
