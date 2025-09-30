import { MEANS_OF_PAYMENT } from "@lib/fetch-payout-information";
import { useState } from "react";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add i18n resource bundles
myI18n.addResourceBundle("en", "rpi/validators", {
    mpesa: {
        required: "Mpesa Number is required",
        notAllowed: "Mpesa Number may NOT be set",
    },
    bankRouting: {
        required: "Bank Routing Number is required",
        notAllowed: "Bank Routing Number may NOT be set",
    },
    bankAccount: {
        required: "Bank Account Number is required",
        notAllowed: "Bank Account Number may NOT be set",
    },
    bankName: {
        required: "Bank Name is required",
        notAllowed: "Bank Name may NOT be set",
    },
});

myI18n.addResourceBundle("pt", "rpi/validators", {
    mpesa: {
        required: "Número Mpesa é obrigatório",
        notAllowed: "Número Mpesa NÃO deve ser preenchido",
    },
    bankRouting: {
        required: "Número de Roteamento Bancário é obrigatório",
        notAllowed: "Número de Roteamento Bancário NÃO deve ser preenchido",
    },
    bankAccount: {
        required: "Número da Conta Bancária é obrigatório",
        notAllowed: "Número da Conta Bancária NÃO deve ser preenchido",
    },
    bankName: {
        required: "Nome do Banco é obrigatório",
        notAllowed: "Nome do Banco NÃO deve ser preenchido",
    },
});

export function useRPIFieldValidators() {
    const { t } = useTranslation("rpi/validators");
    const [selectedPaymentMeans, setSelectedPaymentMeans] = useState<
        MEANS_OF_PAYMENT
    >();

    const handleSelectPaymentMeansChange = (value: MEANS_OF_PAYMENT) => {
        setSelectedPaymentMeans(value);
    };

    const mpesaValidate = (value: number | null) => {
        if (!selectedPaymentMeans) return true;

        if (selectedPaymentMeans === MEANS_OF_PAYMENT.MPESA && !value) {
            return t("mpesa.required");
        }

        if (selectedPaymentMeans !== MEANS_OF_PAYMENT.MPESA && value) {
            return t("mpesa.notAllowed");
        }

        return true;
    };

    const bankRoutingValidate = (value: number | null) => {
        if (!selectedPaymentMeans) return true;

        if (selectedPaymentMeans === MEANS_OF_PAYMENT.BANK && !value) {
            return t("bankRouting.required");
        }

        if (selectedPaymentMeans !== MEANS_OF_PAYMENT.BANK && value) {
            return t("bankRouting.notAllowed");
        }

        return true;
    };

    const bankAccountNumberValidate = (value: number | null) => {
        if (!selectedPaymentMeans) return true;

        if (selectedPaymentMeans === MEANS_OF_PAYMENT.BANK && !value) {
            return t("bankAccount.required");
        }

        if (selectedPaymentMeans !== MEANS_OF_PAYMENT.BANK && value) {
            return t("bankAccount.notAllowed");
        }

        return true;
    };

    const bankNameValidate = (value: number | null) => {
        if (!selectedPaymentMeans) return true;

        if (selectedPaymentMeans === MEANS_OF_PAYMENT.BANK && !value) {
            return t("bankName.required");
        }

        if (selectedPaymentMeans !== MEANS_OF_PAYMENT.BANK && value) {
            return t("bankName.notAllowed");
        }

        return true;
    };

    return {
        handleSelectPaymentMeansChange,
        mpesaValidate,
        bankRoutingValidate,
        bankAccountNumberValidate,
        bankNameValidate,
    };
}
