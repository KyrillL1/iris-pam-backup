import { supabaseBrowserClient } from "@utils/supabase/client";
import { useCallback, useEffect, useState } from "react";

export enum MEANS_OF_PAYMENT {
    CASH = "CASH",
    CHEQUE = "CHEQUE",
    MPESA = "MPESA",
    BANK = "BANK"
}

export const MEANS_OF_PAYMENT_OPTIONS: MEANS_OF_PAYMENT[] = [MEANS_OF_PAYMENT.BANK, MEANS_OF_PAYMENT.CASH, MEANS_OF_PAYMENT.CHEQUE, MEANS_OF_PAYMENT.MPESA];

export interface RecipientPayoutInformationModel {
    id: string;
    created_at: string;
    updated_at: string;
    employee_id: string;
    means_of_payment: MEANS_OF_PAYMENT;
    recipient_name: string;
    mpesa_number?: number;
    bank_routing_number?: number;
    bank_account_number?: number;
    bank_name?: string;
}

export interface RecipientPayoutInformationWithRelationsModel extends RecipientPayoutInformationModel {
    employee?: {
        first_name: string;
        last_name: string;
    }
}

export function useFetchRecipientPayoutInformation() {
    const [recipientPayoutInformation, setRecipientPayoutInformation] = useState<RecipientPayoutInformationModel[]>();

    const fetchRecipientPayoutInformation = useCallback(async () => {
        const { data, error } = await supabaseBrowserClient
            .from("recipient_payout_information")
            .select("*");

        if (data) {
            setRecipientPayoutInformation(data);
        }

        return { data, error }
    }, []);

    useEffect(() => {
        fetchRecipientPayoutInformation();
    }, [])

    return {
        recipientPayoutInformation
    }
}

export function useFetchRecipientPayoutInformationForEmployee() {
    const fetchRecipientPayoutInformationForEmployee = useCallback(async (employeeId: string) => {
        const { data: contracts, error: contractsError } = await supabaseBrowserClient
            .from("contracts")
            .select("*")
            .eq("employee_id", employeeId)
            .is("end_date", null);

        if (contractsError || contracts.length !== 1) {
            return { error: contractsError, data: null }
        }

        const currentContract = contracts[0];

        const { data: recipInfo, error: recipInfoError } = await supabaseBrowserClient
            .from("recipient_payout_information")
            .select("*")
            .eq("contracts_id", currentContract.id)

        if (recipInfoError) {
            return {
                error: recipInfoError,
                data: null
            }
        }

        return {
            error: null,
            data: recipInfo as RecipientPayoutInformationModel[]
        }
    }, []);

    return {
        fetchRecipientPayoutInformationForEmployee
    }
}