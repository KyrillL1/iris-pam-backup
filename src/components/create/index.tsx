"use client";

import React, { JSX, useCallback, useEffect } from "react";
import {
    Autocomplete,
    AutocompleteRenderOptionState,
    Box,
    Button,
    Checkbox,
    Chip,
    FormControlLabel,
    FormHelperText,
    TextField,
} from "@mui/material";
import {
    Create as RefineCreate,
    CreateProps as RefineCreateProps,
    List,
    ListButton,
} from "@refinedev/mui";
import {
    Control,
    Controller,
    ControllerRenderProps,
    FieldValues,
    FormState,
    Path,
} from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import { CrudTitle } from "@components/crud-title";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "create", {
    validations: {
        required: "{{field}} is required",
        min: "{{field}} must be at least {{min}}",
        max: "{{field}} cannot exceed {{max}}",
    },
});

myI18n.addResourceBundle("pt", "create", {
    validations: {
        required: "{{field}} é obrigatório",
        min: "{{field}} deve ser pelo menos {{min}}",
        max: "{{field}} não pode exceder {{max}}",
    },
});

// Supported field types
type FieldType =
    | "text"
    | "number"
    | "date"
    | "select"
    | "boolean"
    | "multiselect"
    | "custom";

type CreateFieldOption = {
    label: string;
    value: string;
};

// Config for each field
export interface CreateFieldConfig<T extends FieldValues = any> {
    name: string;
    label: string;
    type: FieldType;
    options?: (string | CreateFieldOption)[];
    mapOptionToLabel?: (option: any) => string;
    renderOption?: (
        props: React.HTMLAttributes<HTMLLIElement>,
        option: any,
        state: AutocompleteRenderOptionState,
    ) => React.ReactNode;
    renderTags?: (
        value: any[],
        getTagProps: ({ index }: { index: number }) => any,
    ) => React.ReactNode;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    loading?: boolean;
    multiline?: boolean;
    renderCustomField?: (
        control: Control,
        field: CreateFieldConfig,
        formState: FormState<T>,
    ) => JSX.Element;
    onChange?: (value: any) => void;
    include?: boolean;
    validate?: (value: any) => boolean | string;
}

interface CreateProps extends RefineCreateProps {
    fields: CreateFieldConfig[];
    onSave?: (data: any) => void;
}

export function Create<T extends FieldValues>(
    { fields, onSave, ...props }: CreateProps,
) {
    const { t } = useTranslation("create");

    const getValidationMessage = useCallback((
        field: CreateFieldConfig,
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
    const {
        register,
        control,
        formState,
        saveButtonProps,
        unregister,
    } = form;
    const errors = formState.errors;

    const handleSaveButtonClick = onSave
        ? form.handleSubmit((data) => {
            onSave(data);
        })
        : saveButtonProps.onClick;

    useEffect(() => {
        /*
        If a field has been declared, but then later been marked as include=false
        Make sure to unregister again
        */
        for (const field of fields) {
            const include = field.include;
            if (include === false) {
                const { isDirty, isTouched, invalid } = form.getFieldState(
                    field.name,
                );
                if (
                    isDirty || isTouched || invalid ||
                    form.getValues(field.name) !== undefined
                ) {
                    unregister(field.name);
                }
            }
        }
    }, [fields]);

    return (
        <RefineCreate
            {...props}
            saveButtonProps={{
                ...saveButtonProps,
                ...props.saveButtonProps,
                onClick: handleSaveButtonClick,
            }}
            headerButtons={({ defaultButtons }) => (
                <>
                    {defaultButtons}
                    <ListButton />
                </>
            )}
            breadcrumb={false}
            title={props.title ||
                <CrudTitle type="CREATE" />}
        >
            <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                autoComplete="off"
            >
                {fields.map((field) => {
                    if (field.include === false) return;

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
                                            value={controllerField.value}
                                            onChange={(value) => {
                                                controllerField.onChange(
                                                    value,
                                                );
                                                field.onChange?.(value);
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
                        case "number":
                            const regNumber = register(field.name as Path<T>, {
                                required: field.required
                                    ? getValidationMessage(field, "required")
                                    : false,
                                setValueAs: (v) => {
                                    if (
                                        v === "" || v === null ||
                                        v === undefined
                                    ) return null;
                                    const num = Number(v);
                                    return isNaN(num) ? null : num;
                                },
                                validate: (value: number) => {
                                    if (
                                        field.min !== undefined &&
                                        value < field.min
                                    ) {
                                        return getValidationMessage(
                                            field,
                                            "min",
                                            field.min,
                                        );
                                    }
                                    if (
                                        field.max !== undefined &&
                                        value > field.max
                                    ) {
                                        return getValidationMessage(
                                            field,
                                            "max",
                                            field.max,
                                        );
                                    }
                                    if (field.validate) {
                                        return field.validate(value);
                                    }
                                    return true;
                                },
                            });

                            return (
                                <TextField
                                    key={field.name}
                                    {...regNumber}
                                    multiline={field.multiline}
                                    error={!!errorMsg}
                                    helperText={errorMsg}
                                    fullWidth
                                    defaultValue={null}
                                    required={field.required}
                                    label={field.label}
                                    type="number"
                                    onChange={(e) => {
                                        (regNumber as any).onChange?.(e);
                                        field?.onChange?.(e.target.value);
                                    }}
                                    inputProps={{
                                        min: field.min,
                                        max: field.max,
                                        step: field.step,
                                    }}
                                />
                            );

                        case "text":
                            const reg = register(field.name as Path<T>, {
                                required: field.required
                                    ? getValidationMessage(field, "required")
                                    : false,
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
                                    required={field.required}
                                    label={field.label}
                                    type={"text"}
                                    onChange={(e) => {
                                        (reg as any).onChange?.(e);
                                        field?.onChange?.(e.target.value);
                                    }}
                                />
                            );

                        case "select":
                            return (
                                <Controller
                                    key={field.name}
                                    rules={{
                                        required: field.required
                                            ? getValidationMessage(
                                                field,
                                                "required",
                                            )
                                            : false,
                                        validate: field.validate,
                                    }}
                                    name={field.name as Path<T>}
                                    control={control}
                                    defaultValue={"" as any}
                                    render={({ field: controllerField }) => {
                                        const mapOptionToLabel = (
                                            o: string | CreateFieldOption,
                                        ) => {
                                            if (typeof o === "string") return o;
                                            if (o.label !== undefined) {
                                                return o.label;
                                            }
                                            return String(o);
                                        };

                                        const value = field.options?.find(
                                            (o) => {
                                                if (
                                                    typeof o === "string"
                                                ) {
                                                    return controllerField
                                                        .value === o;
                                                }

                                                return controllerField.value ===
                                                    o.value;
                                            },
                                        ) || "";

                                        const onChange = (
                                            _: any,
                                            value:
                                                | string
                                                | CreateFieldOption
                                                | null,
                                        ) => {
                                            const valueAsString =
                                                typeof value === "string"
                                                    ? value
                                                    : value?.value;
                                            controllerField.onChange(
                                                valueAsString,
                                            );
                                            field.onChange?.(valueAsString);
                                        };

                                        return (
                                            <Autocomplete
                                                loading={field.loading}
                                                options={field.options || []}
                                                getOptionLabel={field
                                                    .mapOptionToLabel ||
                                                    mapOptionToLabel}
                                                renderOption={field
                                                    .renderOption}
                                                value={value}
                                                onChange={onChange}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        required={field
                                                            .required}
                                                        label={field.label}
                                                        error={!!errorMsg}
                                                        helperText={errorMsg}
                                                    />
                                                )}
                                            />
                                        );
                                    }}
                                />
                            );

                        case "multiselect":
                            return (
                                <Controller
                                    key={field.name}
                                    name={field.name as Path<T>}
                                    control={control}
                                    defaultValue={[] as any}
                                    rules={{
                                        validate: field.validate,
                                        required: field.required
                                            ? getValidationMessage(
                                                field,
                                                "required",
                                            )
                                            : false,
                                    }}
                                    render={({ field: controllerField }) => (
                                        <Autocomplete
                                            multiple
                                            options={field.options || []}
                                            getOptionLabel={field
                                                .mapOptionToLabel ??
                                                ((o) => (typeof o === "string"
                                                    ? o
                                                    : String(o)))}
                                            renderOption={field.renderOption}
                                            value={controllerField.value || []}
                                            limitTags={2}
                                            disableCloseOnSelect
                                            onChange={(_, value) => {
                                                controllerField.onChange(value);
                                                field.onChange?.(value);
                                            }}
                                            renderTags={field.renderTags}
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
                                        <Box>
                                            <FormControlLabel
                                                sx={{
                                                    color: errorMsg
                                                        ? (t) =>
                                                            t.palette.error.main
                                                        : undefined,
                                                }}
                                                control={
                                                    <Checkbox
                                                        checked={controllerField
                                                            .value}
                                                        onChange={(e) => {
                                                            controllerField
                                                                .onChange(
                                                                    e.target
                                                                        .checked,
                                                                );
                                                            field.onChange?.(
                                                                e.target
                                                                    .checked,
                                                            );
                                                        }}
                                                    />
                                                }
                                                label={field.label}
                                                required={field.required}
                                            />
                                            <FormHelperText
                                                error
                                                sx={{ marginLeft: 2 }}
                                            >
                                                {errorMsg}
                                            </FormHelperText>
                                        </Box>
                                    )}
                                />
                            );

                        case "custom":
                            return field.renderCustomField?.(
                                control,
                                field,
                                formState,
                            );

                        default:
                            return null;
                    }
                })}
            </Box>
        </RefineCreate>
    );
}
