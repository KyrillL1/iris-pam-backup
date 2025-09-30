"use client";

import { Create, CreateFieldConfig } from "@components/create";
import { useFetchEmployees } from "@lib/fetch-employees";
import {
  MEANS_OF_PAYMENT,
  MEANS_OF_PAYMENT_OPTIONS,
  RecipientPayoutInformationModel,
} from "@lib/fetch-payout-information";
import { useRPIFieldValidators } from "../use-RPI-field-validators";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add i18n resource bundles
myI18n.addResourceBundle("en", "rpi/create", {
  fields: {
    employee: "Employee",
    recipient_name: "Recipient Name",
    means_of_payment: "Means of Payment",
    mpesa_number: "MPesa Number",
    bank_routing_number: "Bank Routing Number",
    bank_account_number: "Bank Account Number",
    bank_name: "Bank Name",
  },
});

myI18n.addResourceBundle("pt", "rpi/create", {
  fields: {
    employee: "Funcionário",
    recipient_name: "Nome do Beneficiário",
    means_of_payment: "Método de Pagamento",
    mpesa_number: "Número Mpesa",
    bank_routing_number: "Número de Roteamento Bancário",
    bank_account_number: "Número da Conta Bancária",
    bank_name: "Nome do Banco",
  },
});

export default function EmployeeCreate() {
  const { t } = useTranslation("rpi/create");
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
      label: t("fields.employee"),
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
      options: MEANS_OF_PAYMENT_OPTIONS,
      required: true,
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

  return <Create fields={fields} />;
}
