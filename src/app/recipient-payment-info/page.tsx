"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { RecipientPayoutInformationWithRelationsModel } from "@lib/fetch-payout-information";
import { useTranslationCommon } from "./rpi.common";

export default function RecipientPayoutInformation() {
  const { t } = useTranslationCommon();

  const { dataGridProps } = useDataGrid<
    RecipientPayoutInformationWithRelationsModel
  >({
    meta: {
      select: `
        *,
        employee:employees(first_name, last_name)
      `,
    },
  });

  const columns: GridColDef<RecipientPayoutInformationWithRelationsModel>[] = [
    {
      field: "employee_id",
      headerName: t("fields.employee_id"),
      minWidth: 150,
      valueGetter: (_, row) => {
        const e = row.employee;
        return e ? `${e.first_name} ${e.last_name}` : "";
      },
    },
    {
      field: "recipient_name",
      headerName: t("fields.recipient_name"),
      minWidth: 150,
    },
    {
      field: "means_of_payment",
      headerName: t("fields.means_of_payment"),
      minWidth: 150,
    },
    {
      field: "mpesa_number",
      headerName: t("fields.mpesa_number"),
      minWidth: 150,
    },
    {
      field: "bank_routing_number",
      headerName: t("fields.bank_routing_number"),
      minWidth: 150,
    },
    {
      field: "bank_account_number",
      headerName: t("fields.bank_account_number"),
      minWidth: 150,
    },
    { field: "bank_name", headerName: t("fields.bank_name"), minWidth: 150 },
  ];

  return (
    <List>
      <DataTable<RecipientPayoutInformationWithRelationsModel>
        dataGridProps={dataGridProps}
        columns={columns}
      />
    </List>
  );
}
