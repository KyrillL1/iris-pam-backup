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

export function useHandleDeleteMany() {
    const { selected, clearSelected, toggle } = useSelectMultipleContext();
    const { resource: resourceFromParams } = useResourceParams();
    const { mutate: deleteMany, mutation: { isPending, isSuccess } } =
        useDeleteMany();

    const [confirmDeleteManyOpen, setConfirmDeleteManyOpen] = useState(false);

    const handleDeleteManyClick = useCallback(() => {
        console.log({ selected });
        if (selected?.length === 0 || !selected) {
            return;
        }
        setConfirmDeleteManyOpen(true);
    }, [selected]);

    const handleDeleteManyConfirmed = useCallback(() => {
        setConfirmDeleteManyOpen(false);

        const ids: string[] = selected?.map((item) => {
            return item.value.id;
        }) || [];
        const resource = resourceFromParams?.name;

        if (ids.length === 0 || !resource) {
            return;
        }

        deleteMany({ ids, resource }); // How can I ask the user for confirmation here? Like in useDelete a modal pops up
    }, [selected]);
    useEffect(() => {
        if (!isSuccess) return;

        clearSelected?.();
        toggle?.();
    }, [isSuccess]);

    const confirmationDialog = useMemo(() => {
        return (
            <Dialog
                open={confirmDeleteManyOpen}
                onClose={() => setConfirmDeleteManyOpen(false)}
            >
                <DialogTitle>
                    Are you sure?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText gutterBottom>
                        Confirm Deletion of {selected?.length}{" "}
                        {resourceFromParams?.name}
                    </DialogContentText>
                    <DialogActions sx={{ width: "100%" }}>
                        <Button
                            fullWidth
                            onClick={() => setConfirmDeleteManyOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            color="error"
                            onClick={handleDeleteManyConfirmed}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        );
    }, [confirmDeleteManyOpen]);

    return {
        handleDeleteManyClick,
        confirmationDialog,
        isPending,
    };
}
