"use client";

import { Show, ShowField } from "@components/show";
import { RecipientPayoutInformationWithRelationsModel } from "@lib/fetch-payout-information";
import { useShow } from "@refinedev/core";

export default function RecipientPayoutInformationShow() {
  const { query } = useShow<RecipientPayoutInformationWithRelationsModel>({
    meta: {
      select: `
      *,
      employee:employees(first_name, last_name)
      `
    }
  });
  const { data, isLoading } = query;

  const record = data?.data;

  const fields: ShowField[] = [
    { label: "ID", value: record?.id },
    { label: "Created At", value: record?.created_at, type: "datetime" },
    { label: "Updated At", value: record?.updated_at, type: "datetime" },
    { label: "Employee Name", value: `${record?.employee?.first_name} ${record?.employee?.last_name}` },
    { label: "Recipient Name", value: record?.recipient_name },
    { label: "Means of Payment", value: record?.means_of_payment },
    { label: "MPesa Number", value: record?.mpesa_number, type: "number" },
    { label: "Bank Routing Number", value: record?.bank_routing_number, type: "number" },
    { label: "Bank Account Number", value: record?.bank_account_number, type: "number" },
    { label: "Bank Name", value: record?.bank_name },
  ];

  return <Show isLoading={isLoading} fields={fields} />;
}
