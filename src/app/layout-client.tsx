"use client";

import React from "react";
import { Refine } from "@refinedev/core";
import { RefineKbar } from "@refinedev/kbar";
import {
  RefineSnackbarProvider,
  useNotificationProvider,
} from "@refinedev/mui";
import routerProvider from "@refinedev/nextjs-router";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AppIcon } from "@components/app-icon";
import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProvider } from "@providers/data-provider";
import { resources } from "./resources";
import "moment/locale/pt";

export const LayoutClient: React.FC<{ children: React.ReactNode }> = (
  { children },
) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"pt"}>
      <Refine
        routerProvider={routerProvider}
        authProvider={authProviderClient}
        dataProvider={dataProvider}
        notificationProvider={useNotificationProvider}
        resources={resources}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
          projectId: "a14Qj8-D19Zll-5qGa7R",
          title: {
            icon: <AppIcon />,
            text: "PAM",
          },
        }}
      >
        {children}
        <RefineKbar />
      </Refine>
    </LocalizationProvider>
  );
};
