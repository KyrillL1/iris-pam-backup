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
import { myI18n, useLocale } from "@i18n/i18n-provider";
import { refineI18nProvider } from "@i18n/refine-i18n-provider";
import routerProvider from "@refinedev/nextjs-router/app";

export const LayoutClient: React.FC<
  { children: React.ReactNode }
> = (
  { children },
) => {
  const { locale } = useLocale();

  const localizedResources = useMemo(() => {
    const res = getResources();

    const resWithCorrectPaths = res.map((r) => {
      return {
        ...r,
        list: `/${locale}${r.list}`,
        create: `/${locale}${r.create}`,
        edit: `/${locale}${r.edit}`,
        show: `/${locale}${r.show}`,
      };
    });
    return resWithCorrectPaths;
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
          i18nProvider={refineI18nProvider}
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
