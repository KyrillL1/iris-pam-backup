import { Metadata } from "next";
import React, { Suspense } from "react";
import { Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@providers/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  useNotificationProvider,
  RefineSnackbarProvider,
} from "@refinedev/mui";
import routerProvider from "@refinedev/nextjs-router";

import { AppIcon } from "@components/app-icon";
import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProvider } from "@providers/data-provider";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { Badge } from "@mui/icons-material";
import { resources } from "./resources";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export const metadata: Metadata = {
  title: "PAM",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <Suspense>
          <AppRouterCacheProvider>
            <RefineKbarProvider>
              <RefineSnackbarProvider>
                <ColorModeContextProvider>
                  <DevtoolsProvider>
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
                        }
                      }}
                    >
                      {children}
                      <RefineKbar />
                    </Refine>
                  </DevtoolsProvider>
                </ColorModeContextProvider>
              </RefineSnackbarProvider>
            </RefineKbarProvider>
          </AppRouterCacheProvider>
        </Suspense>
      </body>
    </html >
  );
}
