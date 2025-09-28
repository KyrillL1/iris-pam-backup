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
import { myI18n, useLocale } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "List", {
  "actions.list": "List",
});
myI18n.addResourceBundle("en", "Create", {
  "actions.create": "Create",
});
myI18n.addResourceBundle("en", "Delete", {
  "actions.delete": "Delete",
});

myI18n.addResourceBundle("pt", "List", {
  "actions.list": "Lista",
});
myI18n.addResourceBundle("pt", "Create", {
  "actions.create": "Criar",
});
myI18n.addResourceBundle("pt", "Delete", {
  "actions.delete": "Apagar",
});

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
          i18nProvider={{
            translate: (key: string, ns?: string) => {
              return myI18n.t(key, { ns }).toString() || key;
            },
            changeLocale: (lng: string) =>
              myI18n.changeLanguage(lng),
            getLocale: () =>
              myI18n.language,
          }}
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
