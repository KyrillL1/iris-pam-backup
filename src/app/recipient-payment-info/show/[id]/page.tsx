"use client";

import { Show, ShowField } from "@components/show";
import { RecipientPayoutInformationWithRelationsModel } from "@lib/fetch-payout-information";
import { useShow } from "@refinedev/core";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add i18n resource bundles
myI18n.addResourceBundle("en", "rpi/show", {
  fields: {
    id: "ID",
    created_at: "Created At",
    updated_at: "Updated At",
    employee_name: "Employee Name",
    recipient_name: "Recipient Name",
    means_of_payment: "Means of Payment",
    mpesa_number: "MPesa Number",
    bank_routing_number: "Bank Routing Number",
    bank_account_number: "Bank Account Number",
    bank_name: "Bank Name",
  },
});

myI18n.addResourceBundle("pt", "rpi/show", {
  fields: {
    id: "ID",
    created_at: "Criado em",
    updated_at: "Atualizado em",
    employee_name: "Nome do Funcionário",
    recipient_name: "Nome do Beneficiário",
    means_of_payment: "Método de Pagamento",
    mpesa_number: "Número Mpesa",
    bank_routing_number: "Número de Roteamento Bancário",
    bank_account_number: "Número da Conta Bancária",
    bank_name: "Nome do Banco",
  },
});

export default function RecipientPayoutInformationShow() {
  const { t } = useTranslation("rpi/show");
  const { query } = useShow<RecipientPayoutInformationWithRelationsModel>({
    meta: {
      select: `
                *,
                employee:employees(first_name, last_name)
            `,
    },
  });

  const { data, isLoading } = query;
  const record = data?.data;

  const fields: ShowField[] = [
    { label: t("fields.id"), value: record?.id },
    {
      label: t("fields.created_at"),
      value: record?.created_at,
      type: "datetime",
    },
    {
      label: t("fields.updated_at"),
      value: record?.updated_at,
      type: "datetime",
    },
    {
      label: t("fields.employee_name"),
      value: `${record?.employee?.first_name} ${record?.employee?.last_name}`,
    },
    { label: t("fields.recipient_name"), value: record?.recipient_name },
    { label: t("fields.means_of_payment"), value: record?.means_of_payment },
    {
      label: t("fields.mpesa_number"),
      value: record?.mpesa_number,
      type: "number",
    },
    {
      label: t("fields.bank_routing_number"),
      value: record?.bank_routing_number,
      type: "number",
    },
    {
      label: t("fields.bank_account_number"),
      value: record?.bank_account_number,
      type: "number",
    },
    { label: t("fields.bank_name"), value: record?.bank_name },
  ];

  return <Show isLoading={isLoading} fields={fields} />;
}
