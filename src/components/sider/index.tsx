"use client";

import { AppIcon } from "@components/app-icon";
import { Box, Collapse } from "@mui/material";
import { RefineThemedLayoutSiderProps, ThemedSider, ThemedTitle } from "@refinedev/mui";
import React from "react";
import { Typography, Link as MuiLink } from "@mui/material";
import NextLink from "next/link";

export const Sider: React.FC<RefineThemedLayoutSiderProps> = () => {

  return (
    <ThemedSider
      render={({ items, logout }) => (
        <>
          {items.filter((item: any) => item.key !== "dashboard")}
          {logout} {/* safe because logout is already a ReactNode */}
        </>
      )}
      Title={({ collapsed }) => <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <NextLink href="/" passHref style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: "24px", height: "24px" }}><AppIcon /></Box>

            <Typography
              variant="h6"
              color="textPrimary"
              sx={{
                display: collapsed ? "none" : "block",
                transition: "all 0.5s"
              }}
            >
              PAM
            </Typography>
          </Box>
        </NextLink>
      </Box>}
    />
  );
};
