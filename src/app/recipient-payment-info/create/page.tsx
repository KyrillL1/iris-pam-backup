"use client";

import { Create, CreateFieldConfig } from "@components/create";
import { useFetchEmployees } from "@lib/fetch-employees";
import { MEANS_OF_PAYMENT_OPTIONS } from "@lib/fetch-payout-information";

export default function EmployeeCreate() {
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();

  const fields: CreateFieldConfig[] = [
    {
      name: "employee_id",
      label: "Employee",
      type: "select",
      required: true,
      options: employeeIds,
      mapOptionToLabel: mapEmployeeIdToName
    },
    {
      name: "recipient_name",
      label: "Recipient Name",
      type: "text",
      required: true
    },
    {
      name: "means_of_payment",
      label: "Means of Payment",
      type: "select",
      options: MEANS_OF_PAYMENT_OPTIONS,
      required: true
    },
    {
      name: "mpesa_number",
      label: "Mpesa Number",
      type: "number"
    },
    {
      name: "bank_routing_number",
      label: "Bank Routing Number",
      type: "number"
    },
    {
      name: "bank_account_number",
      label: "Bank Account Number",
      type: "number"
    },
    {
      name: "bank_name",
      label: "Bank Name",
      type: "text"
    },
  ];

  return <Create fields={fields} />;
}