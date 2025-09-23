import { MEANS_OF_PAYMENT } from "@lib/fetch-payout-information";
import { useState } from "react";

export function useRPIFieldValidators() {
    const [selectedPaymentMeans, setSelectedPaymentMeans] = useState<
        MEANS_OF_PAYMENT
    >();

    const handleSelectPaymentMeansChange = (value: MEANS_OF_PAYMENT) => {
        setSelectedPaymentMeans(value);
    };

    const mpesaValidate = (value: number | null) => {
        if (!selectedPaymentMeans) return true;

        if (selectedPaymentMeans === MEANS_OF_PAYMENT.MPESA && !value) {
            return "Mpesa Number is required";
        }

        if (selectedPaymentMeans !== MEANS_OF_PAYMENT.MPESA && value) {
            return "Mpesa Number may NOT be set";
        }

        return true;
    };

    const bankRoutingValidate = (value: number | null) => {
        if (!selectedPaymentMeans) return true;

        if (selectedPaymentMeans === MEANS_OF_PAYMENT.BANK && !value) {
            return "Bank Routing Number is required";
        }

        if (selectedPaymentMeans !== MEANS_OF_PAYMENT.BANK && value) {
            return "Bank Routing Number may NOT be set";
        }

        return true;
    };

    const bankAccountNumberValidate = (value: number | null) => {
        if (!selectedPaymentMeans) return true;

        if (selectedPaymentMeans === MEANS_OF_PAYMENT.BANK && !value) {
            return "Bank Account Number is required";
        }

        if (selectedPaymentMeans !== MEANS_OF_PAYMENT.BANK && value) {
            return "Bank Account Number may NOT be set";
        }

        return true;
    };

    const bankNameValidate = (value: number | null) => {
        if (!selectedPaymentMeans) return true;

        if (selectedPaymentMeans === MEANS_OF_PAYMENT.BANK && !value) {
            return "Bank Name is required";
        }

        if (selectedPaymentMeans !== MEANS_OF_PAYMENT.BANK && value) {
            return "Bank Name may NOT be set";
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
