// Common translations

import { myI18n, useTranslation } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "rpi/common", {
    fields: {
        employee_id: "Employee",
        recipient_name: "Recipient Name",
        means_of_payment: "Means of Payment",
        mpesa_number: "Mpesa Number",
        bank_routing_number: "Bank Routing Number",
        bank_account_number: "Bank Account Number",
        bank_name: "Bank Name",
    },
});

myI18n.addResourceBundle("pt", "rpi/common", {
    fields: {
        employee_id: "Funcionário",
        recipient_name: "Nome do Beneficiário",
        means_of_payment: "Meio de Pagamento",
        mpesa_number: "Número Mpesa",
        bank_routing_number: "Número de Roteamento Bancário",
        bank_account_number: "Número da Conta Bancária",
        bank_name: "Nome do Banco",
    },
});

export function useTranslationCommon(additionalNs?: string) {
    return useTranslation([
        "rpi/common",
        ...(additionalNs ? [additionalNs] : []),
    ]);
}
