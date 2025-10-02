"use client";

import React, { useCallback } from "react";
import {
    Autocomplete,
    AutocompleteRenderOptionState,
    Box,
    Checkbox,
    FormControlLabel,
    TextField,
} from "@mui/material";
import {
    Edit as RefineEdit,
    EditProps as RefineEditProps,
} from "@refinedev/mui";
import { Controller, FieldValues, Path } from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { CrudTitle } from "@components/crud-title";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "edit", {
    validations: {
        required: "{{field}} is required",
        min: "{{field}} must be at least {{min}}",
        max: "{{field}} cannot exceed {{max}}",
    },
});

myI18n.addResourceBundle("pt", "edit", {
    validations: {
        required: "{{field}} é obrigatório",
        min: "{{field}} deve ser pelo menos {{min}}",
        max: "{{field}} não pode exceder {{max}}",
    },
});

// Field types supported
type FieldType =
    | "text"
    | "number"
    | "date"
    | "select"
    | "boolean"
    | "multiline";

// Configuration for each field
export interface EditFieldConfig {
    name: string;
    label: string;
    type: FieldType;
    options?: any[]; // for select/autocomplete
    // for select/autocomplete. useful if you want to show other value than the actual option (e.g. for foreign ids)
    mapOptionToLabel?: (option: any) => string;
    renderOption?: (
        props: React.HTMLAttributes<HTMLLIElement> & { key: any },
        option: string,
        state: AutocompleteRenderOptionState,
    ) => React.ReactNode;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number; // for number/currency
    multiline?: boolean;
    isEditable?: boolean;
    validate?: (value: any) => string | boolean;
    onChange?: (value: any) => void;
}

// Props for generic RecordEdit
interface EditProps extends RefineEditProps {
    fields: EditFieldConfig[];
}

export function Edit<T extends FieldValues>({ fields, ...props }: EditProps) {
    const { t } = useTranslation("edit");

    const getValidationMessage = useCallback((
        field: EditFieldConfig,
        type: "required" | "min" | "max",
        value?: number,
    ) => {
        switch (type) {
            case "required":
                return t("validations.required", { field: field.label });
            case "min":
                return t("validations.min", { field: field.label, min: value });
            case "max":
                return t("validations.max", { field: field.label, max: value });
        }
    }, [t]);
    const form = useForm<T>();

    const { register, control, formState: { errors }, saveButtonProps } = form;

    return (
        <RefineEdit
            {...props}
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
            title={props.title || <CrudTitle type="EDIT" />}
            goBack={false}
        >
            <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                autoComplete="off"
            >
                {fields.map((field) => {
                    const errorMsg = (errors as any)[field.name]?.message;

                    switch (field.type) {
                        case "date":
                            return (
                                <Controller
                                    key={field.name}
                                    name={field.name}
                                    control={control}
                                    defaultValue={null} // or undefined
                                    rules={{
                                        required: field.required
                                            ? getValidationMessage(
                                                field,
                                                "required",
                                            )
                                            : false,
                                        validate: field.validate,
                                    }}
                                    render={({ field: controllerField }) => (
                                        <DatePicker
                                            {...controllerField}
                                            value={controllerField.value
                                                ? moment(
                                                    controllerField.value,
                                                )
                                                : null}
                                            onChange={(value) => {
                                                controllerField.onChange(
                                                    value,
                                                );
                                                field?.onChange?.(value);
                                            }}
                                            slotProps={{
                                                textField: {
                                                    required: field.required,
                                                    label: field.label,
                                                    fullWidth: true,
                                                    error: !!errorMsg,
                                                    helperText: errorMsg,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            );
                        case "text":
                        case "number":
                            const reg = register(field.name as Path<T>, {
                                required: field.required
                                    ? getValidationMessage(field, "required")
                                    : false,
                                valueAsNumber: field.type === "number",
                                min: field.min
                                    ? getValidationMessage(
                                        field,
                                        "min",
                                        field.min,
                                    )
                                    : undefined,
                                max: field.max
                                    ? getValidationMessage(
                                        field,
                                        "max",
                                        field.max,
                                    )
                                    : undefined,
                                validate: field.validate,
                            });
                            return (
                                <TextField
                                    key={field.name}
                                    {...reg}
                                    multiline={field.multiline}
                                    error={!!errorMsg}
                                    helperText={errorMsg}
                                    fullWidth
                                    onChange={(e) => {
                                        (reg as any).onChange?.(e);
                                        field?.onChange?.(e.target.value);
                                    }}
                                    required={field.required}
                                    contentEditable={field.isEditable}
                                    label={field.label}
                                    type={field.type === "number"
                                        ? "number"
                                        : "text"}
                                    slotProps={{
                                        inputLabel: { shrink: true },
                                        htmlInput: {
                                            min: field.min,
                                            max: field.max,
                                            step: field.step,
                                            required: field.required,
                                        },
                                    }}
                                />
                            );

                        case "select":
                            return (
                                <Controller
                                    key={field.name}
                                    name={field.name as any}
                                    control={control}
                                    defaultValue={null as any}
                                    rules={{
                                        required: field.required
                                            ? getValidationMessage(
                                                field,
                                                "required",
                                            )
                                            : false,
                                        validate: field.validate,
                                    }}
                                    render={({ field: controllerField }) => (
                                        <Autocomplete
                                            {...controllerField}
                                            options={field.options || []}
                                            getOptionLabel={field
                                                .mapOptionToLabel}
                                            renderOption={field.renderOption}
                                            onChange={(_, value) => {
                                                controllerField.onChange(value);
                                                field?.onChange?.(value);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={field.label}
                                                    error={!!errorMsg}
                                                    helperText={errorMsg}
                                                    required={field.required}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            );

                        case "boolean":
                            return (
                                <Controller
                                    key={field.name}
                                    name={field.name as any}
                                    control={control}
                                    defaultValue={false}
                                    rules={{
                                        required: field.required
                                            ? getValidationMessage(
                                                field,
                                                "required",
                                            )
                                            : false,
                                        validate: field.validate,
                                    }}
                                    render={({ field: controllerField }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    {...controllerField}
                                                    checked={controllerField
                                                        .value}
                                                    onChange={(e) => {
                                                        controllerField
                                                            .onChange(
                                                                e.target
                                                                    .checked,
                                                            );
                                                        field?.onChange?.(
                                                            e.target.checked,
                                                        );
                                                    }}
                                                />
                                            }
                                            label={field.label}
                                        />
                                    )}
                                />
                            );

                        default:
                            return null;
                    }
                })}
            </Box>
        </RefineEdit>
    );
}
