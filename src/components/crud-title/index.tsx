import { myI18n, useTranslation } from "@i18n/i18n-provider";
import { Typography } from "@mui/material";
import { useResourceParams } from "@refinedev/core";
import React from "react";

myI18n.addResourceBundle("en", "crudtitle", {
    edit: "Edit {{resource}}",
    show: "Show {{resource}}",
    create: "Create {{resource}}",
    fallback: "- {{resource}}",
});
myI18n.addResourceBundle("pt", "crudtitle", {
    edit: "Editar {{resource}}",
    show: "Mostrar {{resource}}",
    create: "Criar {{resource}}",
    fallback: "- {{resource}}",
});

export const CrudTitle: React.FC<{ type: "EDIT" | "CREATE" | "SHOW" }> = (
    { type },
) => {
    const { t } = useTranslation("crudtitle");
    const { resource } = useResourceParams();

    let messageKey = "fallback";
    if (type === "EDIT") {
        messageKey = "edit";
    }
    if (type === "CREATE") {
        messageKey = "create";
    }
    if (type === "SHOW") {
        messageKey = "show";
    }

    return (
        <Typography variant="h5">
            {t(messageKey, { resource: resource?.meta?.label })}
        </Typography>
    );
};
