"use client";

import { Show, ShowField } from "@components/show";
import { RecipientPayoutInformationWithRelationsModel } from "@lib/fetch-payout-information";
import { useShow } from "@refinedev/core";
import { useTranslationCommon } from "../../rpi.common";

export default function RecipientPayoutInformationShow() {
  const { t } = useTranslationCommon();
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

  return <Show isLoading={isLoading} fields={fields} record={record} />;
}
