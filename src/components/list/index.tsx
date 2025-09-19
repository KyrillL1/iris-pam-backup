"use client";

import { Stack } from "@mui/material";
import { List as RefineList, ListProps, RefreshButton } from "@refinedev/mui";
import React from "react";

export const List: React.FC<ListProps> = (props) => {

  return (
    <RefineList
      {...props}
      headerButtons={({ defaultButtons }) => (
        <Stack direction="row" spacing={1} alignContent="center">
          {defaultButtons}
          <RefreshButton hideText />
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