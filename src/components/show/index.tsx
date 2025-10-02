"use client";

import { CrudTitle } from "@components/crud-title";
import { Stack, Typography } from "@mui/material";
import {
    BooleanField,
    DateField,
    NumberField,
    Show as RefineShow,
    ShowProps as RefineShowProps,
    TextFieldComponent,
} from "@refinedev/mui";
import { formatMoney } from "@utils/format-money";
import { JSX } from "react";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

type FieldType =
    | "text"
    | "number"
    | "date"
    | "datetime"
    | "boolean"
    | "money"
    | "custom";

export interface ShowField {
    label: string;
    value?: any;
    type?: FieldType;
    custom?: (value: any) => JSX.Element;
}

export interface ShowProps extends RefineShowProps {
    isLoading: boolean;
    fields: ShowField[];
}

// Add translations
myI18n.addResourceBundle("en", "common/show", {
    SHOW: "Details",
});

myI18n.addResourceBundle("pt", "common/show", {
    SHOW: "Detalhes",
});

/**
 * Generic component to show any record (with translations)
 */
export const Show: React.FC<ShowProps> = ({ isLoading, fields, ...props }) => {
    const { t } = useTranslation("common/show");

    return (
        <RefineShow
            {...props}
            isLoading={isLoading}
            breadcrumb={false}
            title={props.title || <CrudTitle type={"SHOW"} />}
            goBack={false}
        >
            <Stack gap={1}>
                {fields.map((field, idx) => (
                    <div key={idx}>
                        <Typography variant="body1" fontWeight="bold">
                            {t(field.label)}
                        </Typography>
                        {field.type === "number"
                            ? <NumberField value={field.value} />
                            : field.type === "date"
                            ? <DateField value={field.value} />
                            : field.type === "datetime"
                            ? (
                                <DateField
                                    value={field.value}
                                    format="DD/MM/YYYY HH:mm:ss"
                                />
                            )
                            : field.type === "boolean"
                            ? <BooleanField value={field.value} />
                            : field.type === "money"
                            ? (
                                <TextFieldComponent
                                    value={formatMoney(field.value)}
                                />
                            )
                            : field.type === "custom"
                            ? <>{field.custom?.(field.value)}</>
                            : <TextFieldComponent value={field.value} />}
                    </div>
                ))}
            </Stack>
        </RefineShow>
    );
};
