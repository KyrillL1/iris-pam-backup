import { supabaseBrowserClient } from "@utils/supabase/client";
import { useEffect, useState } from "react";

export interface DepartmentOption {
    id: string;
    name: string;
}

export function useFetchDepartments() {
    const [departments, setDepartments] = useState<DepartmentOption[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDepartments = async () => {
            setLoading(true);
            const { data, error } = await supabaseBrowserClient
                .from("departments")
                .select("id, name")
                .order("name", { ascending: true });

            if (!error && data) {
                setDepartments(data);
            }
            setLoading(false);
        };

        fetchDepartments();
    }, []);

    return { departments, loading };
}
