import { supabaseBrowserClient } from "@utils/supabase/client";
import { useCallback } from "react";
import { useFetchCurrentContract } from "./fetch-contracts";
import { useNotification } from "@refinedev/core";
import { useHandleError } from "@utils/use-handle-error";

interface QueryResult {
    id: string;
    pay_adjustment_id: string;
    comment?: string;
    employee_id: string;
    user_input?: number;
    pay_adjustment?: {
        id: string;
        adjustment_type: "AMOUNT" | "GS_PERCENTAGE" | "FORMULA";
        amount?: number;
        percentage?: number;
        formula?: string;
    };
}

export function useCalculatePayAdjustmentAmount() {
    const { fetchCurrentContract } = useFetchCurrentContract();
    const { open } = useNotification();
    const { handleError } = useHandleError();

    const calculatePayAdjustmentAmount = useCallback(
        async (
            payAdjustmentToEmployeesId: string,
            hoursWorked?: number,
        ): Promise<number> => {
            const { data, error } = await supabaseBrowserClient
                .from("pay_adjustments_to_employees")
                .select(`
                id, 
                pay_adjustment_id, 
                employee_id,
                comment, 
                user_input, 
                pay_adjustment:pay_adjustments(
                    id,
                    adjustment_type, 
                    amount, 
                    percentage, 
                    formula
                )
            `)
                .eq("id", payAdjustmentToEmployeesId)
                .limit(1);

            if (error || !data) {
                const message =
                    `Missing response on calculatePayAdjustmentAmount for ${payAdjustmentToEmployeesId}`;
                handleError(new Error(message));
                return -1;
            }

            const queryResult = data as unknown as QueryResult[];

            if (queryResult.length !== 1) {
                const message =
                    `Invalid length for ${payAdjustmentToEmployeesId}: ${queryResult.length}`;
                open?.({ message, type: "error" });
                handleError(new Error(message));
                return -1;
            }

            const {
                pay_adjustment_id,
                user_input,
                pay_adjustment,
                employee_id,
            } = queryResult[0];

            if (!pay_adjustment) {
                const message = `No pay_adjustment on queryResult`;
                open?.({ message, type: "error" });
                handleError(new Error(message));
                return -1;
            }

            const {
                adjustment_type,
                amount,
                percentage,
                formula,
            } = pay_adjustment;

            if (adjustment_type === "AMOUNT") {
                return user_input || amount || -1;
            }

            const currentContract = await fetchCurrentContract(employee_id);

            if (!currentContract) {
                const message = `Missing current contract`;
                open?.({ message, type: "error" });
                handleError(new Error(message));
                return -1;
            }

            const grossSalary = currentContract.calculation_basis === "HOURLY"
                ? currentContract.base_salary * (hoursWorked || 0)
                : currentContract.base_salary *
                    currentContract.work_percentage / 100;

            if (adjustment_type === "GS_PERCENTAGE") {
                return grossSalary * (percentage || 0) / 100;
            }

            // adjustment_type === FORMULA
            return -1;
        },
        [],
    );

    return {
        calculatePayAdjustmentAmount,
    };
}
