"use client";

import { Create, CreateFieldConfig } from "@components/create";
import { useFetchEmployees } from "@lib/fetch-employees";
import {
  MEANS_OF_PAYMENT,
  MEANS_OF_PAYMENT_OPTIONS,
  RecipientPayoutInformationModel,
} from "@lib/fetch-payout-information";
import { useState } from "react";
import { useRPIFieldValidators } from "../use-RPI-field-validators";

export default function EmployeeCreate() {
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();
  const {
    handleSelectPaymentMeansChange,
    mpesaValidate,
    bankNameValidate,
    bankAccountNumberValidate,
    bankRoutingValidate,
  } = useRPIFieldValidators();

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
      onChange: handleSelectPaymentMeansChange,
    },
    {
      name: "mpesa_number",
      label: "Mpesa Number",
      type: "number",
      validate: mpesaValidate,
    },
    {
      name: "bank_routing_number",
      label: "Bank Routing Number",
      type: "number",
      validate: bankRoutingValidate,
    },
    {
      name: "bank_account_number",
      label: "Bank Account Number",
      type: "number",
      validate: bankAccountNumberValidate,
    },
    {
      name: "bank_name",
      label: "Bank Name",
      type: "text",
      validate: bankNameValidate,
    },
  ];

  return <Create fields={fields} />;
}
