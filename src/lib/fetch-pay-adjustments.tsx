"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabaseBrowserClient } from "@utils/supabase/client";

export enum PayAdjustmentType {
    AMOUNT = "AMOUNT",
    GS_PERCENTAGE = "GS_PERCENTAGE",
    FORMULA = "FORMULA",
}

export interface PayAdjustments {
    id: string; // UUID
    created_at: string; // timestamp with time zone
    updated_at: string; // timestamp with time zone
    name: string;
    is_credit: boolean;
    adjustment_type: PayAdjustmentType;
    amount?: number; // for PayAdjustmentType.AMOUNT
    percentage?: number; // for PayAdjustmentType.GS_PERCENTAGE
    formula?: string; // for PayAdjustmentType.FORMULA
}

export interface PayAdjustmentsToEmployees {
    id: string; // UUID
    created_at: string; // timestamp with time zone
    updated_at: string; // timestamp with time zone
    employee_id: string; // UUID
    pay_adjustment_id: string; // UUID
    comment?: string;
    // Will override USER_INPUT in formulas and replace amount for amounts
    userInput?: number;
    start_date: string; // Date
    end_date: string | null; // Date
}

export interface PayAdjustmentsToEmployeesWithRelations
    extends PayAdjustmentsToEmployees {
    employee?: {
        id: string;
        first_name: string;
        last_name: string;
    };
    pay_adjustment?: {
        id: string;
        name: string;
        is_credit: boolean;
    };
}

export function useFetchPayAdjustments() {
    const [payAdjustments, setPayAdjustments] = useState<PayAdjustments[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const { data, error } = await supabaseBrowserClient
                .from("pay_adjustments")
                .select("*")
                .order("is_credit", { ascending: false }) // credits first (true > false)
                .order("name", { ascending: true });

            if (!error && data) {
                setPayAdjustments(data);
            }
            setLoading(false);
        };

        fetch();
    }, []);

    const payAdjustmentIds = useMemo(() => {
        return payAdjustments.map((p) => p.id);
    }, [payAdjustments]);

    const mapPayAdjustmentIdToName = useCallback((id: string) => {
        return payAdjustments.find((p) => p.id === id)?.name || "";
    }, [payAdjustments]);

    return {
        payAdjustments,
        payAdjustmentIds,
        mapPayAdjustmentIdToName,
        loading,
    };
}

export function useFetchPayAdjustmentsForEmployee() {
    const [
        payAdjustments,
        setPayAdjustments,
    ] = useState<PayAdjustmentsToEmployeesWithRelations[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async (employeeId: string) => {
        setLoading(true);
        const { data, error } = await supabaseBrowserClient
            .from("pay_adjustments_to_employees")
            .select(
                "*, employee:employees(first_name, last_name), pay_adjustment:pay_adjustments(id, is_credit, name)",
            )
            .eq("employee_id", employeeId);

        if (!error && data) {
            setPayAdjustments(data);
            setLoading(false);
            return data;
        }
        setLoading(false);
    }, []);

    return {
        fetch,
        payAdjustments,
        loading,
    };
}
