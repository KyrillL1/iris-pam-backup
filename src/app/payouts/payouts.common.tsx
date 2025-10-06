// Common translations

import { myI18n, useTranslation } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "payouts/common", {
    fields: {
        employee_contract: "Employee + Contract",
        amount: "Amount",
        payout_slip: "Payout Slip",
    },
});

myI18n.addResourceBundle("pt", "payouts/common", {
    fields: {
        employee_contract: "Funcionário + Contrato",
        amount: "Valor",
        payout_slip: "Comprovante de Pagamento",
    },
});

export function useTranslationCommon(additionalNs?: string) {
    return useTranslation([
        "payouts/common",
        ...(additionalNs ? [additionalNs] : []),
    ]);
}
