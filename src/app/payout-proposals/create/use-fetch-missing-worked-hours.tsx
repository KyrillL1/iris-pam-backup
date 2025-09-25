import { supabaseBrowserClient } from "@utils/supabase/client";
import { useCallback, useEffect, useState } from "react";

interface MissingWorkedHours {
    contract_id: string;
    employee_id: string;
    employee_name: string;
}

interface ContractRow {
    id: string;
    calculation_basis: string;
    employee_id: string;
    employee: {
        first_name: string;
        last_name: string;
    };
}

export function useFetchMissingWorkedHours(includeContractIds?: string[]) {
    const [missingWorkedHours, setMissingWorkedHours] = useState<
        MissingWorkedHours[]
    >();
    const [missingWorkedHoursError, setMissingWorkedHoursError] = useState<
        Error
    >();
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabaseBrowserClient
            .from("contracts")
            .select(
                "id, calculation_basis, employee_id, employee:employees(first_name, last_name)",
            )
            .eq("calculation_basis", "HOURLY")
            .overrideTypes<ContractRow[]>();

        if (error) {
            setLoading(false);
            setMissingWorkedHoursError(error);
            return { data: null, error };
        }

        setMissingWorkedHours(
            data.filter((c) => {
                const contractShallBeIncluded = (includeContractIds || [])
                    .includes(c.id);
                return contractShallBeIncluded;
            }).map((c) => {
                const employee_name =
                    `${c.employee.first_name} ${c.employee.last_name}`;
                return {
                    employee_id: c.employee_id,
                    contract_id: c.id,
                    employee_name,
                };
            }),
        );
        setLoading(false);
        return {
            data,
            error: null,
        };
    }, [includeContractIds]);

    useEffect(() => {
        fetch();
    }, [includeContractIds]);

    return {
        missingWorkedHours,
        missingWorkedHoursError,
        loading,
    };
}
