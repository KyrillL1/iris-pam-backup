"use client";

import { Show, ShowField } from "@components/show";
import { RecipientPayoutInformationWithRelationsModel } from "@lib/fetch-payout-information";
import { useShow } from "@refinedev/core";
import { myI18n } from "@i18n/i18n-provider";
import { useTranslationCommon } from "../../rpi.common";

// Add i18n resource bundles
myI18n.addResourceBundle("en", "rpi/show", {
  fields: {
    id: "ID",
    created_at: "Created At",
    updated_at: "Updated At",
  },
});

myI18n.addResourceBundle("pt", "rpi/show", {
  fields: {
    id: "ID",
    created_at: "Criado em",
    updated_at: "Atualizado em",
  },
});

export default function RecipientPayoutInformationShow() {
  const { t } = useTranslationCommon("rpi/show");
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
    { label: t("rpi/show:fields.id"), value: record?.id },
    {
      label: t("rpi/show:fields.created_at"),
      value: record?.created_at,
      type: "datetime",
    },
    {
      label: t("rpi/show:fields.updated_at"),
      value: record?.updated_at,
      type: "datetime",
    },
    {
      label: t("fields.employee_id"),
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
