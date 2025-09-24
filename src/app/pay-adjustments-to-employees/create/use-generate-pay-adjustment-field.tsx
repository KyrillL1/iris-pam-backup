import { useCallback } from "react";
import { PayAdjustmentField } from "./pay-adjustment-field.model";
import {
    Autocomplete,
    Box,
    Card,
    IconButton,
    MenuItem,
    TextField,
} from "@mui/material";
import {
    Control,
    Controller,
    FieldErrors,
    Path,
    UseFormRegister,
    UseFormUnregister,
    UseFormWatch,
} from "react-hook-form";
import { useFetchPayAdjustments } from "@lib/fetch-pay-adjustments";
import { payAdjustmentOptionFactory } from "../pay-adjustment-option-factory";
import { Remove } from "@mui/icons-material";
import { usePrintPayAdjustmentSubtext } from "./use-print-pay-adjustment-subtext";
import { DatePicker } from "@mui/x-date-pickers";

export interface GeneratePayAdjustmentFieldOptions {
    control: Control;
    errors: FieldErrors;
    watch: UseFormWatch<any>;
    register: UseFormRegister<any>;
    onRemovePayAdjustmentField: (field: PayAdjustmentField) => void;
}

export function useGeneratePayAdjustmentField(
    {
        control,
        errors,
        watch,
        register,
        onRemovePayAdjustmentField,
    }: GeneratePayAdjustmentFieldOptions,
) {
    const { payAdjustmentIds, payAdjustments, mapPayAdjustmentIdToName } =
        useFetchPayAdjustments();
    const { printPayAdjustmentSubtext } = usePrintPayAdjustmentSubtext();

    const generatePayAdjustmentField = useCallback(
        (field: PayAdjustmentField) => {
            const selectedPayAdjustmentId = watch(field.name) as
                | string
                | undefined;
            const selectedPayAdjustment = payAdjustments.find((p) =>
                p.id === selectedPayAdjustmentId
            );

            return (
                <Card
                    key={field.key}
                    sx={{
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
                        <Controller
                            key={field.key}
                            rules={{ required: `${field.label} is required` }}
                            name={field.name as Path<any>}
                            control={control}
                            defaultValue={"" as any}
                            render={({ field: controllerField }) => (
                                <Autocomplete
                                    sx={{ flexGrow: "3", minWidth: 0 }}
                                    options={payAdjustmentIds}
                                    getOptionLabel={mapPayAdjustmentIdToName}
                                    renderOption={(props, option) => {
                                        const id = option;
                                        const fullPayAdjustment = payAdjustments
                                            .find((p) => p.id === id);

                                        if (!fullPayAdjustment) {
                                            return (
                                                <MenuItem key={id} value={id}>
                                                    Missing Item
                                                </MenuItem>
                                            );
                                        }

                                        return (
                                            <MenuItem
                                                {...props}
                                                key={id}
                                                value={id}
                                            >
                                                {payAdjustmentOptionFactory(
                                                    fullPayAdjustment,
                                                )}
                                            </MenuItem>
                                        );
                                    }}
                                    onChange={(_, value) =>
                                        controllerField.onChange(value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={field.label}
                                            error={!!(errors as any)[field.name]
                                                ?.message}
                                            helperText={(errors as any)[
                                                field.name
                                            ]
                                                ?.message}
                                            required
                                        />
                                    )}
                                />
                            )}
                        />
                        <TextField
                            {...register(field.userInputName, {
                                valueAsNumber: true,
                                setValueAs: (v) => (v === "" ? -1 : v),
                            })}
                            sx={{ flexGrow: 1 }}
                            required={false}
                            defaultValue={""}
                            label={"Custom User Input"}
                            placeholder="Leave empty for default"
                            type={"number"}
                            slotProps={{
                                htmlInput: { min: 0 },
                                inputLabel: { shrink: true },
                            }}
                        />
                        <IconButton
                            color="error"
                            onClick={() => onRemovePayAdjustmentField(field)}
                        >
                            <Remove />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            gap: 2,
                            alignItems: "center",
                            paddingLeft: 4,
                        }}
                    >
                        {printPayAdjustmentSubtext(selectedPayAdjustment)}
                        <TextField
                            {...register(field.commentName)}
                            sx={{ flexGrow: 1 }}
                            multiline
                            required={false}
                            defaultValue={""}
                            label={"Comment"}
                            placeholder="Optional"
                            type={"text"}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                        <Controller
                            key={field.startDateName}
                            name={field.startDateName}
                            control={control}
                            defaultValue={null} // or undefined
                            rules={{ required: "Start Date is required" }}
                            render={({ field: controllerField }) => (
                                <DatePicker
                                    {...controllerField}
                                    value={controllerField.value}
                                    onChange={(value) => {
                                        controllerField.onChange(
                                            value,
                                        );
                                    }}
                                    sx={{
                                        flexGrow: 1,
                                    }}
                                    slotProps={{
                                        textField: {
                                            required: true,
                                            label: "Start Date",
                                            fullWidth: true,
                                            error: !!(errors as any)[
                                                field.startDateName
                                            ]
                                                ?.message,
                                            helperText: (errors as any)[
                                                field.startDateName
                                            ]
                                                ?.message,
                                        },
                                    }}
                                />
                            )}
                        />
                        <Controller
                            key={field.endDateName}
                            name={field.endDateName}
                            control={control}
                            defaultValue={null} // or undefined
                            render={({ field: controllerField }) => (
                                <DatePicker
                                    {...controllerField}
                                    value={controllerField.value}
                                    onChange={(value) => {
                                        controllerField.onChange(
                                            value,
                                        );
                                    }}
                                    sx={{
                                        flexGrow: 1,
                                    }}
                                    slotProps={{
                                        textField: {
                                            label: "End Date",
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            )}
                        />
                    </Box>
                </Card>
            );
        },
        [control, errors, payAdjustmentIds, payAdjustments],
    );

    return {
        generatePayAdjustmentField,
    };
}
