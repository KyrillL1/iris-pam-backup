"use client";

import { useRPIFieldValidators } from "@app/recipient-payment-info/use-RPI-field-validators";
import { Edit, EditFieldConfig } from "@components/edit";
import { Employee, useFetchEmployees } from "@lib/fetch-employees";
import { MEANS_OF_PAYMENT_OPTIONS } from "@lib/fetch-payout-information";

export default function RecipientPayoutInformationEdit() {
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();
  const {
    handleSelectPaymentMeansChange,
    mpesaValidate,
    bankNameValidate,
    bankAccountNumberValidate,
    bankRoutingValidate,
  } = useRPIFieldValidators();

  const fields: EditFieldConfig[] = [
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
      required: true,
      options: MEANS_OF_PAYMENT_OPTIONS,
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

  return <Edit<Employee> fields={fields} />;
}
