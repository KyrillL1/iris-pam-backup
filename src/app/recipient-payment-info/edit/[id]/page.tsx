"use client";

import { useRPIFieldValidators } from "@app/recipient-payment-info/use-RPI-field-validators";
import { Edit, EditFieldConfig } from "@components/edit";
import { Employee, useFetchEmployees } from "@lib/fetch-employees";
import { MEANS_OF_PAYMENT_OPTIONS } from "@lib/fetch-payout-information";
import { useTranslationCommon } from "../../rpi.common";

export default function RecipientPayoutInformationEdit() {
  const { t } = useTranslationCommon();
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
      label: t("fields.employee_id"),
      type: "select",
      required: true,
      options: employeeIds,
      mapOptionToLabel: mapEmployeeIdToName,
    },
    {
      name: "recipient_name",
      label: t("fields.recipient_name"),
      type: "text",
      required: true,
    },
    {
      name: "means_of_payment",
      label: t("fields.means_of_payment"),
      type: "select",
      required: true,
      options: MEANS_OF_PAYMENT_OPTIONS,
      onChange: handleSelectPaymentMeansChange,
    },
    {
      name: "mpesa_number",
      label: t("fields.mpesa_number"),
      type: "number",
      validate: mpesaValidate,
    },
    {
      name: "bank_routing_number",
      label: t("fields.bank_routing_number"),
      type: "number",
      validate: bankRoutingValidate,
    },
    {
      name: "bank_account_number",
      label: t("fields.bank_account_number"),
      type: "number",
      validate: bankAccountNumberValidate,
    },
    {
      name: "bank_name",
      label: t("fields.bank_name"),
      type: "text",
      validate: bankNameValidate,
    },
  ];

  return <Edit<Employee> fields={fields} />;
}
