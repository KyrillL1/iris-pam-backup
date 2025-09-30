"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { RecipientPayoutInformationWithRelationsModel } from "@lib/fetch-payout-information";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add translation bundles
myI18n.addResourceBundle("en", "recipient-payout-information/list", {
  title: "Recipient Payout Information",
  columns: {
    employee_id: "Employee",
    recipient_name: "Recipient Name",
    means_of_payment: "Means of Payment",
    mpesa_number: "Mpesa Number",
    bank_routing_number: "Bank Routing Number",
    bank_account_number: "Bank Account Number",
    bank_name: "Bank Name",
  },
});

myI18n.addResourceBundle("pt", "recipient-payout-information/list", {
  title: "Informação de Pagamento ao Beneficiário",
  columns: {
    employee_id: "Funcionário",
    recipient_name: "Nome do Beneficiário",
    means_of_payment: "Meio de Pagamento",
    mpesa_number: "Número Mpesa",
    bank_routing_number: "Número de Roteamento Bancário",
    bank_account_number: "Número da Conta Bancária",
    bank_name: "Nome do Banco",
  },
});

export default function RecipientPayoutInformation() {
  const { t } = useTranslation("recipient-payout-information/list");

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
      headerName: t("columns.employee_id"),
      minWidth: 150,
      valueGetter: (_, row) => {
        const e = row.employee;
        return e ? `${e.first_name} ${e.last_name}` : "";
      },
    },
    {
      field: "recipient_name",
      headerName: t("columns.recipient_name"),
      minWidth: 150,
    },
    {
      field: "means_of_payment",
      headerName: t("columns.means_of_payment"),
      minWidth: 150,
    },
    {
      field: "mpesa_number",
      headerName: t("columns.mpesa_number"),
      minWidth: 150,
    },
    {
      field: "bank_routing_number",
      headerName: t("columns.bank_routing_number"),
      minWidth: 150,
    },
    {
      field: "bank_account_number",
      headerName: t("columns.bank_account_number"),
      minWidth: 150,
    },
    { field: "bank_name", headerName: t("columns.bank_name"), minWidth: 150 },
  ];

  return (
    <List title={t("title")}>
      <DataTable<RecipientPayoutInformationWithRelationsModel>
        dataGridProps={dataGridProps}
        columns={columns}
      />
    </List>
  );
}
