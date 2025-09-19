"use client";

import React from "react";
import {
    Box,
    TextField,
    Autocomplete,
    Checkbox,
    FormControlLabel,
    AutocompleteRenderOptionState,
} from "@mui/material";
import { Edit as RefineEdit } from "@refinedev/mui";
import { Controller, FieldValues, Path } from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";


// Field types supported
type FieldType = "text" | "number" | "date" | "select" | "boolean" | "multiline";

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
}

// Props for generic RecordEdit
interface EditProps {
    fields: EditFieldConfig[];
}

export function Edit<T extends FieldValues>({ fields }: EditProps) {
    const form = useForm<T>();

    const { register, control, formState: { errors }, saveButtonProps } = form;

    return (
        <RefineEdit saveButtonProps={saveButtonProps}>
            <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                autoComplete="off"
            >
                {fields.map((field) => {
                    const errorMsg = (errors as any)[field.name]?.message;

                    switch (field.type) {
                        case "text":
                        case "number":
                        case "date":
                            return (
                                <TextField
                                    key={field.name}
                                    {...register(field.name as Path<T>, {
                                        required: field.required ? `${field.label} is required` : false,
                                        valueAsNumber: field.type === "number",
                                        min: field.min,
                                        max: field.max,
                                    })}
                                    multiline={field.multiline}
                                    error={!!errorMsg}
                                    helperText={errorMsg}
                                    fullWidth
                                    contentEditable={field.isEditable}
                                    label={field.label}
                                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                                    slotProps={{
                                        inputLabel: { shrink: true }, htmlInput: {
                                            min: field.min,
                                            max: field.max,
                                            step: field.step,
                                        }
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
                                    render={({ field: controllerField }) => (
                                        <Autocomplete
                                            {...controllerField}
                                            options={field.options || []}
                                            getOptionLabel={field.mapOptionToLabel}
                                            renderOption={field.renderOption}
                                            onChange={(_, value) => controllerField.onChange(value)}
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
                                    render={({ field: controllerField }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    {...controllerField}
                                                    checked={controllerField.value}
                                                    onChange={(e) => controllerField.onChange(e.target.checked)}
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
        </RefineEdit >
    );
}
