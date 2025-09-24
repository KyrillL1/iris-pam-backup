import { Metadata } from "next";
import React, { CSSProperties, Suspense } from "react";
import { Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@providers/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  Breadcrumb,
  RefineSnackbarProvider,
  useNotificationProvider,
} from "@refinedev/mui";
import routerProvider from "@refinedev/nextjs-router";

import { AppIcon } from "@components/app-icon";
import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProvider } from "@providers/data-provider";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { Badge } from "@mui/icons-material";
import { resources } from "./resources";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LayoutClient } from "./layout-client";

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
  // https://jeffbridgforth.com/fix-scroll-bounce-with-css/ (Sept 2024)
  const preventWeirdOverscrollIssues: CSSProperties = {
    height: "100%",
    margin: 0,
    padding: 0,
    overflowX: "hidden",
    overscrollBehaviorY: "none",
  };
  return (
    <html
      lang="en"
      style={preventWeirdOverscrollIssues}
    >
      <body
        style={preventWeirdOverscrollIssues}
      >
        <Suspense>
          <AppRouterCacheProvider>
            <RefineKbarProvider>
              <RefineSnackbarProvider>
                <ColorModeContextProvider>
                  <DevtoolsProvider>
                    <LayoutClient>
                      {children}
                    </LayoutClient>
                  </DevtoolsProvider>
                </ColorModeContextProvider>
              </RefineSnackbarProvider>
            </RefineKbarProvider>
          </AppRouterCacheProvider>
        </Suspense>
      </body>
    </html>
  );
}
