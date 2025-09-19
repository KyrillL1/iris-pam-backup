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

export function useFetchMissingWorkedHours() {
    const [missingWorkedHours, setMissingWorkedHours] = useState<
        MissingWorkedHours[]
    >();
    const [missingWorkedHoursError, setMissingWorkedHoursError] = useState<
        Error
    >();

    const fetch = useCallback(async () => {
        const { data, error } = await supabaseBrowserClient
            .from("contracts")
            .select(
                "id, calculation_basis, employee_id, employee:employees(first_name, last_name)",
            )
            .eq("calculation_basis", "HOURLY")
            .overrideTypes<ContractRow[]>();

        if (error) {
            setMissingWorkedHoursError(error);
            return { data: null, error };
        }

        setMissingWorkedHours(data.map((c) => {
            const employee_name =
                `${c.employee.first_name} ${c.employee.last_name}`;
            return {
                employee_id: c.employee_id,
                contract_id: c.id,
                employee_name,
            };
        }));
        return {
            data,
            error: null,
        };
    }, []);

    useEffect(() => {
        fetch();
    }, []);

    return {
        missingWorkedHours,
        missingWorkedHoursError,
    };
}
