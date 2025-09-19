"use client";

import React, { JSX, useCallback, useEffect } from "react";
import {
    Box,
    TextField,
    Autocomplete,
    Checkbox,
    FormControlLabel,
    Chip,
    AutocompleteRenderOptionState,
} from "@mui/material";
import { Create as RefineCreate, CreateProps as RefineCreateProps } from "@refinedev/mui";
import { Control, Controller, FieldValues, FormState, Path } from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";

// Supported field types
type FieldType = "text" | "number" | "date" | "select" | "boolean" | "multiselect" | "custom";

// Config for each field
export interface CreateFieldConfig<T extends FieldValues = any> {
    name: string;
    label: string;
    type: FieldType;
    options?: any[];
    mapOptionToLabel?: (option: any) => string;
    renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: any, state: AutocompleteRenderOptionState,) => React.ReactNode;
    renderTags?: (value: any[], getTagProps: ({ index }: { index: number }) => any) => React.ReactNode;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    loading?: boolean;
    multiline?: boolean;
    renderCustomField?: (control: Control, field: CreateFieldConfig, formState: FormState<T>) => JSX.Element;
    onChange?: (value: any) => void;
    include?: boolean
}

interface CreateProps extends RefineCreateProps {
    fields: CreateFieldConfig[];
    onSave?: (data: any) => void;
}

export function Create<T extends FieldValues>({ fields, onSave, ...props }: CreateProps) {
    const form = useForm<T>();
    const {
        register,
        control,
        formState,
        saveButtonProps,
        unregister
    } = form;
    const errors = formState.errors;

    const handleSaveButtonClick = onSave ?
        form.handleSubmit((data) => {
            onSave(data);
        }) :
        saveButtonProps.onClick

    useEffect(() => {
        /*
        If a field has been declared, but then later been marked as include=false
        Make sure to unregister again
        */
        for (const field of fields) {
            const include = field.include;
            if (include === false) {
                const { isDirty, isTouched, invalid } = form.getFieldState(field.name);
                if (isDirty || isTouched || invalid || form.getValues(field.name) !== undefined) {
                    unregister(field.name);
                }
            }
        }
    }, [fields])

    return (
        <RefineCreate {...props} saveButtonProps={{
            ...saveButtonProps,
            ...props.saveButtonProps,
            onClick: handleSaveButtonClick
        }}>
            <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                autoComplete="off"
            >
                {fields.map((field) => {
                    if (field.include === false) return;

                    const errorMsg = (errors as any)[field.name]?.message;

                    switch (field.type) {
                        case "text":
                        case "number":
                        case "date":
                            const reg = register(field.name as Path<T>, {
                                required: field.required ? `${field.label} is required` : false,
                                valueAsNumber: field.type === "number",
                                setValueAs: (v) => (v === "" ? null : v)
                            })
                            return (
                                <TextField
                                    key={field.name}
                                    {...reg}
                                    multiline={field.multiline}
                                    error={!!errorMsg}
                                    helperText={errorMsg}
                                    fullWidth
                                    label={field.label}
                                    type={
                                        field.type === "number"
                                            ? "number"
                                            : field.type === "date"
                                                ? "date"
                                                : "text"
                                    }
                                    onChange={(e) => {
                                        (reg as any).onChange?.(e);
                                        field?.onChange?.(e.target.value);
                                    }}
                                    InputLabelProps={
                                        field.type === "date" ? { shrink: true } : undefined
                                    }
                                    slotProps={{
                                        htmlInput: {
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
                                    rules={{ required: `${field.label} is required` }}
                                    name={field.name as Path<T>}
                                    control={control}
                                    defaultValue={"" as any}
                                    render={({ field: controllerField }) => (
                                        <Autocomplete
                                            loading={field.loading}
                                            options={field.options || []}
                                            getOptionLabel={
                                                field.mapOptionToLabel ??
                                                ((o) => (typeof o === "string" ? o : String(o)))
                                            }
                                            renderOption={field.renderOption}
                                            value={
                                                field.options?.find(
                                                    (o) => o === controllerField.value
                                                ) || null
                                            }
                                            onChange={(_, value) => {
                                                controllerField.onChange(value);
                                                field.onChange?.(value);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={field.label}
                                                    error={!!errorMsg}
                                                    helperText={errorMsg}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            );

                        case "multiselect":
                            return (
                                <Controller
                                    key={field.name}
                                    name={field.name as Path<T>}
                                    control={control}
                                    defaultValue={[] as any}
                                    render={({ field: controllerField }) => (
                                        <Autocomplete
                                            multiple
                                            options={field.options || []}
                                            getOptionLabel={
                                                field.mapOptionToLabel ??
                                                ((o) => (typeof o === "string" ? o : String(o)))
                                            }
                                            renderOption={field.renderOption}
                                            value={
                                                controllerField.value || []
                                            }
                                            limitTags={2}
                                            disableCloseOnSelect
                                            onChange={(_, value) => {
                                                controllerField.onChange(value);
                                                field.onChange?.(value);
                                            }}
                                            renderTags={
                                                field.renderTags
                                            }
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
                                    name={field.name as Path<T>}
                                    control={control}
                                    defaultValue={false as any}
                                    render={({ field: controllerField }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={controllerField.value}
                                                    onChange={(e) => {
                                                        controllerField.onChange(e.target.checked);
                                                        field.onChange?.(e.target.checked);
                                                    }
                                                    }
                                                />
                                            }
                                            label={field.label}
                                        />
                                    )}
                                />
                            );

                        case "custom":
                            return field.renderCustomField?.(control, field, formState)

                        default:
                            return null;
                    }
                })}
            </Box>
        </RefineCreate >
    );
}
