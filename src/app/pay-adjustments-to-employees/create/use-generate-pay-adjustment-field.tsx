"use client";

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
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Translation bundles
myI18n.addResourceBundle("en", "pay-adjustment-field", {
    required: "{{label}} is required",
    customInputLabel: "Custom User Input",
    customInputPlaceholder: "Leave empty for default",
    commentLabel: "Comment",
    commentPlaceholder: "Optional",
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
});

myI18n.addResourceBundle("pt", "pay-adjustment-field", {
    required: "{{label}} é obrigatório",
    customInputLabel: "Entrada do Usuário",
    customInputPlaceholder: "Deixe vazio para padrão",
    commentLabel: "Comentário",
    commentPlaceholder: "Opcional",
    startDateLabel: "Data Início",
    endDateLabel: "Data Fim",
});

export interface GeneratePayAdjustmentFieldOptions {
    control: Control;
    errors: FieldErrors;
    watch: UseFormWatch<any>;
    register: UseFormRegister<any>;
    unregister?: UseFormUnregister<any>;
    onRemovePayAdjustmentField: (field: PayAdjustmentField) => void;
}

export function useGeneratePayAdjustmentField({
    control,
    errors,
    watch,
    register,
    onRemovePayAdjustmentField,
}: GeneratePayAdjustmentFieldOptions) {
    const { t } = useTranslation("pay-adjustment-field");

    const { payAdjustmentIds, payAdjustments, mapPayAdjustmentIdToName } =
        useFetchPayAdjustments();
    const { printPayAdjustmentSubtext } = usePrintPayAdjustmentSubtext();

    const generatePayAdjustmentField = useCallback(
        (field: PayAdjustmentField) => {
            const selectedPayAdjustmentId = watch(field.name) as
                | string
                | undefined;
            const selectedPayAdjustment = payAdjustments.find(
                (p) => p.id === selectedPayAdjustmentId,
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
                            rules={{
                                required: t("required", { label: field.label }),
                            }}
                            name={field.name as Path<any>}
                            control={control}
                            defaultValue={"" as any}
                            render={({ field: controllerField }) => (
                                <Autocomplete
                                    sx={{ flexGrow: "3", minWidth: 0 }}
                                    options={payAdjustmentIds}
                                    getOptionLabel={mapPayAdjustmentIdToName}
                                    renderOption={(props, option) => {
                                        const fullPayAdjustment = payAdjustments
                                            .find(
                                                (p) => p.id === option,
                                            );
                                        if (!fullPayAdjustment) {
                                            return (
                                                <MenuItem
                                                    {...props}
                                                    key={option}
                                                    value={option}
                                                >
                                                    Missing Item
                                                </MenuItem>
                                            );
                                        }
                                        return (
                                            <MenuItem
                                                {...props}
                                                key={option}
                                                value={option}
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
                                            ]?.message}
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
                            label={t("customInputLabel")}
                            placeholder={t("customInputPlaceholder")}
                            type="number"
                            inputProps={{ min: 0 }}
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
                            label={t("commentLabel")}
                            placeholder={t("commentPlaceholder")}
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                        <Controller
                            key={field.startDateName}
                            name={field.startDateName}
                            control={control}
                            defaultValue={null}
                            rules={{
                                required: t("required", {
                                    label: t("startDateLabel"),
                                }),
                            }}
                            render={({ field: controllerField }) => (
                                <DatePicker
                                    {...controllerField}
                                    value={controllerField.value}
                                    onChange={controllerField.onChange}
                                    sx={{ flexGrow: 1 }}
                                    slotProps={{
                                        textField: {
                                            required: true,
                                            label: t("startDateLabel"),
                                            fullWidth: true,
                                            error:
                                                !!(errors as any)[
                                                    field.startDateName
                                                ]?.message,
                                            helperText:
                                                (errors as any)[
                                                    field.startDateName
                                                ]?.message,
                                        },
                                    }}
                                />
                            )}
                        />

                        <Controller
                            key={field.endDateName}
                            name={field.endDateName}
                            control={control}
                            defaultValue={null}
                            render={({ field: controllerField }) => (
                                <DatePicker
                                    {...controllerField}
                                    value={controllerField.value}
                                    onChange={controllerField.onChange}
                                    sx={{ flexGrow: 1 }}
                                    slotProps={{
                                        textField: {
                                            label: t("endDateLabel"),
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
        [
            control,
            errors,
            payAdjustmentIds,
            payAdjustments,
            register,
            watch,
            onRemovePayAdjustmentField,
            printPayAdjustmentSubtext,
            t,
        ],
    );

    return { generatePayAdjustmentField };
}
