import { useCallback } from "react";
import { FieldValue, FieldValues } from "react-hook-form";
import {
    stringIsCommentFieldName,
    stringIsEmployeeFieldName,
    stringIsEndDateField,
    stringIsFieldName,
    stringIsStartDateField,
    stringIsUserInputFieldName,
} from "./constants";
import { useNavigation, useNotification } from "@refinedev/core";
import { supabaseBrowserClient } from "@utils/supabase/client";

interface ParsedData {
    payAdjustmentId: string;
    userInput: number | null;
    comment: string | null;
    employeeId: string;
    startDate: Date;
    endDate: Date | null;
}

export function useHandleFormSave<T extends FieldValues>() {
    const { open } = useNotification();
    const { list } = useNavigation();
    const handleFormSave = useCallback(async (data: FieldValue<T>) => {
        const parsedAdjustmentIds: string[] = [];
        const parsedUserInputs: number[] = [];
        const parsedComments: string[] = [];
        const parsedStartDates: string[] = [];
        const parsedEndDates: string[] = [];
        let employeeId: string = "";
        for (let key in data) {
            const value = data[key];
            if (stringIsEmployeeFieldName(key)) {
                employeeId = value;
                continue;
            }
            if (stringIsFieldName(key)) {
                parsedAdjustmentIds.push(value);
                continue;
            }
            if (stringIsUserInputFieldName(key)) {
                parsedUserInputs.push(value);
                continue;
            }
            if (stringIsCommentFieldName(key)) {
                parsedComments.push(value);
                continue;
            }
            if (stringIsStartDateField(key)) {
                parsedStartDates.push(value);
                continue;
            }
            if (stringIsEndDateField(key)) {
                parsedEndDates.push(value);
                continue;
            }
        }

        // Check all are the same length
        const lengthAdj = parsedAdjustmentIds.length;
        const lengthCom = parsedComments.length;
        const lengthUsIn = parsedUserInputs.length;
        const lengthStD = parsedStartDates.length;
        const lengthEnD = parsedEndDates.length;
        if (
            lengthAdj !== lengthCom &&
            lengthCom !== lengthUsIn &&
            lengthUsIn !== lengthStD &&
            lengthStD !== lengthEnD
        ) {
            console.error("Cant save. Parsed arrays unequal length", {
                parsedAdjustmentIds,
                parsedUserInputs,
                parsedComments,
                parsedEndDates,
                parsedStartDates,
            });
            open?.({
                message: "Cant save. Parsed arrays unequal length",
                type: "error",
            });
            return;
        }

        const parsedData: ParsedData[] = [];
        for (let i = 0; i < parsedAdjustmentIds.length; i++) {
            const parsedAdjustmentId = parsedAdjustmentIds[i];
            const parsedUserInput = isNaN(parsedUserInputs[i])
                ? null
                : parsedUserInputs[i];
            const parsedComment = parsedComments[i] === ""
                ? null
                : parsedComments[i];
            const parsedEndDate = parsedEndDates[i] === ""
                ? null
                : new Date(parsedEndDates[i]);
            const parsedStartDate = new Date(parsedStartDates[i]);
            parsedData.push({
                payAdjustmentId: parsedAdjustmentId,
                userInput: parsedUserInput,
                comment: parsedComment,
                employeeId,
                startDate: parsedStartDate,
                endDate: parsedEndDate,
            });
        }

        // Insert into Supabase
        const { error } = await supabaseBrowserClient
            .from("pay_adjustments_to_employees")
            .insert(
                parsedData.map((item) => ({
                    employee_id: item.employeeId,
                    pay_adjustment_id: item.payAdjustmentId,
                    comment: item.comment,
                    user_input: item.userInput,
                    end_date: item.endDate,
                    start_date: item.startDate,
                })),
            );

        if (error) {
            console.error("Supabase insert failed", error);
            open?.({ message: "Failed to save adjustments", type: "error" });
        } else {
            open?.({
                message: "Adjustments saved successfully",
                type: "success",
            });
        }
        list("pay_adjustments_to_employees");
    }, []);

    return {
        handleFormSave,
    };
}
