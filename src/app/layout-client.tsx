"use client";

import React, { useMemo } from "react";
import { Refine } from "@refinedev/core";
import { RefineKbar } from "@refinedev/kbar";
import { useNotificationProvider } from "@refinedev/mui";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AppIcon } from "@components/app-icon";
import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProvider } from "@providers/data-provider";
import { getResources } from "./resources";
import "moment/locale/pt";
import { SelectMultipleProvider } from "@contexts/select-multiple";
import { routerProvider } from "@providers/router-provider";
import { useLocale } from "@i18n/i18n-provider";

export const LayoutClient: React.FC<
  { children: React.ReactNode }
> = (
  { children },
) => {
  const { locale } = useLocale();

  const localizedResources = useMemo(() => {
    return getResources();
  }, [locale]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
      <SelectMultipleProvider>
        <Refine
          routerProvider={routerProvider}
          authProvider={authProviderClient}
          dataProvider={dataProvider}
          notificationProvider={useNotificationProvider}
          resources={localizedResources}
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
      </SelectMultipleProvider>
    </LocalizationProvider>
  );
};
