import { supabaseBrowserClient } from "@utils/supabase/client";
import { truncateId } from "@utils/truncate-id";
import { useEffect, useMemo, useState } from "react";

export interface Employee {
    id: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    birthdate: string; // coming from DB as string
    gender: string;
    household_size: number;
    social_security_number: string;
    quickbooks_name: string;
}

export function useFetchEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDepartments = async () => {
            setLoading(true);
            const { data, error } = await supabaseBrowserClient
                .from<"employees", Employee>("employees")
                .select("*")
                .order("last_name", { ascending: true });

            if (!error && data) {
                setEmployees(data);
            }
            setLoading(false);
        };

        fetchDepartments();
    }, []);

    const employeeNames = useMemo(() => {
        if (!employees) return;
        return employees.map((e) =>
            `${e.first_name} ${e.last_name} (#${truncateId(e.id)} )`
        );
    }, [employees]);
    const employeeIds = useMemo(() => {
        if (!employees) return;
        return employees.map((e) => e.id);
    }, [employees]);

    const mapEmployeeIdToName = (id: string) => {
        const e = employees.find((e) => e.id === id);
        if (!e) return id;
        return `${e.first_name} ${e.last_name} (#${truncateId(e.id)} )`;
    };

    return {
        employees,
        employeeNames,
        employeeIds,
        mapEmployeeIdToName,
        loading,
    };
}
