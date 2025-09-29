"use client";

import { useSelectMultipleContext } from "@contexts/select-multiple";
import {
  ArrowDropDown,
  CheckBoxOutlineBlank,
  Checklist,
  Delete,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useDelete, useDeleteMany, useResourceParams } from "@refinedev/core";
import {
  CreateButton,
  List as RefineList,
  ListProps as RefineListProps,
  RefreshButton,
} from "@refinedev/mui";
import React, { useCallback, useState } from "react";
import { useHandleDeleteMany } from "./use-handle-delete-many";

export const List: React.FC<RefineListProps> = (
  { canCreate = true, ...props },
) => {
  const { toggle, showMultiple, clearSelected } = useSelectMultipleContext();

  const {
    handleDeleteManyClick,
    confirmationDialog,
    isPending,
  } = useHandleDeleteMany();

  const handleToggleSelectMany = useCallback(() => {
    toggle?.();
    clearSelected?.();
  }, []);

  const { resource } = useResourceParams();

  return (
    <RefineList
      {...props}
      title={<Typography variant="h6">{resource?.meta?.label}</Typography>}
      headerButtons={() => (
        <Stack
          direction="row"
          spacing={1}
          alignItems={"center"}
        >
          {showMultiple && resource?.meta?.canDelete && (
            <>
              <IconButton
                color="error"
                sx={{
                  bgcolor: (theme) => theme.palette.error.main,
                  color: "#fff",
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.error.dark,
                  },
                  borderRadius: 2,
                  height: 32,
                }}
                loading={isPending}
                onClick={handleDeleteManyClick}
              >
                <Delete />
              </IconButton>
              {confirmationDialog}
            </>
          )}
          {resource?.create && canCreate && (
            <CreateButton hideText variant="outlined" sx={{ border: "none" }} />
          )}
          <RefreshButton hideText />
          <IconButton
            size="small"
            color="primary"
            sx={{
              borderRadius: 2,
              width: 52,
              height: 32,
            }}
            onClick={handleToggleSelectMany}
          >
            <Checklist />
          </IconButton>
        </Stack>
      )}
      createButtonProps={{
        children: "New",
        color: "primary",
        variant: "contained",
        sx: { borderRadius: "8px" },
        hideText: true,
      }}
    />
  );
};
