"use client";

import { Create, CreateFieldConfig } from "@components/create";
import { useFetchEmployees } from "@lib/fetch-employees";
import {
  MEANS_OF_PAYMENT,
  MEANS_OF_PAYMENT_OPTIONS,
  RecipientPayoutInformationModel,
} from "@lib/fetch-payout-information";
import { useState } from "react";

export default function EmployeeCreate() {
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();

  const [selectedPaymentMeans, setSelectedPaymentMeans] = useState<
    MEANS_OF_PAYMENT
  >();

  const fields: CreateFieldConfig[] = [
    {
      name: "employee_id",
      label: "Employee",
      type: "select",
      required: true,
      options: employeeIds,
      mapOptionToLabel: mapEmployeeIdToName,
    },
    {
      name: "recipient_name",
      label: "Recipient Name",
      type: "text",
      required: true,
    },
    {
      name: "means_of_payment",
      label: "Means of Payment",
      type: "select",
      options: MEANS_OF_PAYMENT_OPTIONS,
      required: true,
      onChange: setSelectedPaymentMeans,
    },
    {
      name: "mpesa_number",
      label: "Mpesa Number",
      type: "number",
      validate: (value: number | null) => {
        if (!selectedPaymentMeans) return true;

        if (selectedPaymentMeans === MEANS_OF_PAYMENT.MPESA && !value) {
          return "Mpesa Number is required";
        }

        if (selectedPaymentMeans !== MEANS_OF_PAYMENT.MPESA && value) {
          return "Mpesa Number may NOT be set";
        }

        return true;
      },
    },
    {
      name: "bank_routing_number",
      label: "Bank Routing Number",
      type: "number",
      validate: (value: number | null) => {
        if (!selectedPaymentMeans) return true;

        if (selectedPaymentMeans === MEANS_OF_PAYMENT.BANK && !value) {
          return "Bank Routing Number is required";
        }

        if (selectedPaymentMeans !== MEANS_OF_PAYMENT.BANK && value) {
          return "Bank Routing Number may NOT be set";
        }

        return true;
      },
    },
    {
      name: "bank_account_number",
      label: "Bank Account Number",
      type: "number",
      validate: (value: number | null) => {
        if (!selectedPaymentMeans) return true;

        if (selectedPaymentMeans === MEANS_OF_PAYMENT.BANK && !value) {
          return "Bank Account Number is required";
        }

        if (selectedPaymentMeans !== MEANS_OF_PAYMENT.BANK && value) {
          return "Bank Account Number may NOT be set";
        }

        return true;
      },
    },
    {
      name: "bank_name",
      label: "Bank Name",
      type: "text",
      validate: (value: number | null) => {
        if (!selectedPaymentMeans) return true;

        if (selectedPaymentMeans === MEANS_OF_PAYMENT.BANK && !value) {
          return "Bank Name is required";
        }

        if (selectedPaymentMeans !== MEANS_OF_PAYMENT.BANK && value) {
          return "Bank Name may NOT be set";
        }

        return true;
      },
    },
  ];

  return <Create fields={fields} />;
}
