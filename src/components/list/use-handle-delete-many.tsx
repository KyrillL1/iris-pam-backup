import { useSelectMultipleContext } from "@contexts/select-multiple";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useDeleteMany, useResourceParams } from "@refinedev/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// i18n translations for this component
myI18n.addResourceBundle("en", "delete-many", {
    title: "Are you sure?",
    confirmText: "Confirm Deletion of {{count}} {{resource}}",
    cancel: "Cancel",
    delete: "Delete",
});

myI18n.addResourceBundle("pt", "delete-many", {
    title: "Tem certeza?",
    confirmText: "Confirmar exclusão de {{count}} {{resource}}",
    cancel: "Cancelar",
    delete: "Excluir",
});

export function useHandleDeleteMany() {
    const { t } = useTranslation("delete-many");

    const { selected, clearSelected, toggle } = useSelectMultipleContext();
    const { resource: resourceFromParams } = useResourceParams();
    const { mutate: deleteMany, mutation: { isPending, isSuccess } } =
        useDeleteMany();

    const [confirmDeleteManyOpen, setConfirmDeleteManyOpen] = useState(false);

    const handleDeleteManyClick = useCallback(() => {
        if (!selected || selected.length === 0) return;
        setConfirmDeleteManyOpen(true);
    }, [selected]);

    const handleDeleteManyConfirmed = useCallback(() => {
        setConfirmDeleteManyOpen(false);

        const ids: string[] = selected?.map((item) => item.value.id) || [];
        const resource = resourceFromParams?.name;
        if (!ids.length || !resource) return;

        deleteMany({ ids, resource });
    }, [selected]);

    useEffect(() => {
        if (!isSuccess) return;
        clearSelected?.();
        toggle?.();
    }, [isSuccess]);

    const confirmationDialog = useMemo(() => (
        <Dialog
            open={confirmDeleteManyOpen}
            onClose={() => setConfirmDeleteManyOpen(false)}
        >
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom>
                    {t("confirmText", {
                        count: selected?.length,
                        resource: resourceFromParams?.name,
                    })}
                </DialogContentText>
                <DialogActions sx={{ width: "100%" }}>
                    <Button
                        fullWidth
                        onClick={() => setConfirmDeleteManyOpen(false)}
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        fullWidth
                        color="error"
                        onClick={handleDeleteManyConfirmed}
                    >
                        {t("delete")}
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    ), [confirmDeleteManyOpen, selected, resourceFromParams]);

    return {
        handleDeleteManyClick,
        confirmationDialog,
        isPending,
    };
}
