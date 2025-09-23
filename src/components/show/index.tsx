"use client";

import { Breadcrumb } from "@components/breadcrumb";
import { Stack, Typography } from "@mui/material";
import { BooleanField, Show as RefineShow } from "@refinedev/mui";
import { DateField, NumberField, TextFieldComponent } from "@refinedev/mui";
import { formatMoney } from "@utils/format-money";
import { JSX } from "react";

type FieldType = "text" | "number" | "date" | "boolean" | "money" | "custom";

export interface ShowField {
    label: string;
    value?: any;
    type?: FieldType;
    custom?: (value: any) => JSX.Element;
}

export interface ShowProps {
    isLoading: boolean;
    fields: ShowField[];
}

/**
 * Generic component to show any record
 */
export const Show: React.FC<ShowProps> = ({ isLoading, fields }) => {
    return (
        <RefineShow isLoading={isLoading} breadcrumb={false}>
            <Stack gap={1}>
                {fields.map((field, idx) => (
                    <div key={idx}>
                        <Typography variant="body1" fontWeight="bold">
                            {field.label}
                        </Typography>
                        {field.type === "number"
                            ? <NumberField value={field.value} />
                            : field.type === "date"
                            ? <DateField value={field.value} />
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
