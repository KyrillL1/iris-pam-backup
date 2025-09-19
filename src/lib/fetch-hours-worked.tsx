import { useCallback } from "react";
import { useFetchCurrentContract } from "./fetch-contracts";
import { supabaseBrowserClient } from "@utils/supabase/client";

export function useFetchHoursWorked() {
    const { fetchCurrentContract } = useFetchCurrentContract();

    const fetchHoursWorked = useCallback(async (employeeId: string) => {
        const currentContract = await fetchCurrentContract(employeeId);
        if (!currentContract) {
            return {
                data: null,
                error: new Error("Missing currentContract")
            }
        }

        const { data, error } = await supabaseBrowserClient
            .from("hours_worked")
            .select("*")
            .eq("contract_id", currentContract.id)
            .limit(1);

        if (error) {
            return {
                data: null,
                error
            }
        }

        return {
            data: data[0].hours as number,
            error: null
        }
    }, [fetchCurrentContract]);

    return {
        fetchHoursWorked
    }
}