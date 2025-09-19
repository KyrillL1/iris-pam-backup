import { supabaseBrowserClient } from "@utils/supabase/client";
import { useCallback, useEffect, useState } from "react";

export interface Contract {
    id: string; // UUID
    created_at: string; // timestamp with time zone
    updated_at: string; // timestamp with time zone
    employee_id: string; // UUID
    department_id: string; // UUID
    contract_type: 'freelancer' | 'regular' | 'temporary';
    determined: boolean;
    work_percentage: number; // 0 - 100
    start_date: string; // date in ISO format
    end_date: string | null; // nullable date
    calculation_basis: 'MONTHLY' | 'HOURLY';
    base_salary: number; // numeric(12,2);
    job_title: string;
}

export interface ContractWithRelations extends Contract {
    department: {
        name: string;
    };
    employee: {
        first_name: string;
        last_name: string;
    }
}

export function useFetchContractsWithRelations() {
    const [contractsWithRelations, setContractsWithRelations] = useState<ContractWithRelations[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await supabaseBrowserClient
                .from("contracts")
                .select(`
                    *,
                    department:departments(name),
                    employee:employees(first_name, last_name)
                `);

            if (!error && data) {
                setContractsWithRelations(data);
            }
        };

        fetch();
    }, []);


    return { contractsWithRelations }
}

export function useFetchContracts() {
    const [contracts, setContracts] = useState<ContractWithRelations[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await supabaseBrowserClient
                .from("contracts")
                .select(`
                    *
                `)
                .order("name", { ascending: true });

            if (!error && data) {
                setContracts(data);
            }
        };

        fetch();
    }, []);


    return { contracts }
}

export function useFetchCurrentContract() {
    const [currentContract, setCurrentContract] = useState<Contract>();

    const fetchCurrentContract = useCallback(async (employeeId: string) => {
        const { data, error } = await supabaseBrowserClient
            .from("contracts")
            .select(`
                    *
                `)
            .eq("employee_id", employeeId)
            .is("end_date", null)
            .limit(1)

        if (!error && data) {
            setCurrentContract(data[0]);
            return data[0] as Contract
        }
    }, []);

    return {
        currentContract,
        fetchCurrentContract
    }
}
