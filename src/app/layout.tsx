import { Metadata } from "next";
import React, { CSSProperties, Suspense } from "react";
import { DevtoolsProvider } from "@providers/devtools";
import { RefineKbarProvider } from "@refinedev/kbar";
import { RefineSnackbarProvider } from "@refinedev/mui";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { LayoutClient } from "./layout-client";
import {
  fallbackLng,
  headerName,
  languages,
} from "@providers/i18n-provider/settings";
import { headers } from "next/headers";

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

  const lang = await (await headers()).get(headerName) || fallbackLng;

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
                    <LayoutClient lang={lang}>
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
