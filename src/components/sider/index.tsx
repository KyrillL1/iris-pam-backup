"use client";

import { AppIcon } from "@components/app-icon";
import {
  alpha,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  RefineThemedLayoutSiderProps,
  ThemedSider,
  ThemedTitle,
} from "@refinedev/mui";
import React, { useMemo } from "react";
import { Link as MuiLink, Typography } from "@mui/material";
import NextLink from "next/link";
import { useMenu, useRefineContext } from "@refinedev/core";

export const Sider: React.FC<RefineThemedLayoutSiderProps> = () => {
  const { menuItems } = useMenu();
  const items = useMemo(() => {
  }, []);

  return (
    <ThemedSider
      render={({ collapsed }) => {
        const { menuItems, selectedKey } = useMenu();
        return (
          <>
            {menuItems.map(({ label, route, icon, key }) => {
              return (
                <ListItemButton
                  key={key}
                  component={NextLink}
                  href={route || "/"}
                  selected={key === selectedKey}
                  aria-label={label}
                  prefetch={true}
                  sx={{
                    height: 48, // fixed height like MUI default
                    "&.Mui-selected": {
                      color: (theme) => theme.palette.primary.main,
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.2),
                    },
                    borderRadius: 0,
                    paddingX: 2, // padding-left and right 16px
                    paddingY: 1, // padding-top and bottom 8px
                    justifyContent: "center",
                    minWidth: 0,
                    textAlign: "left",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  {icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? 0 : 40,
                        color: (theme) => theme.palette.primary.main,
                      }}
                    >
                      {/* controls spacing of icon */}
                      {icon}
                    </ListItemIcon>
                  )}
                  {!collapsed && (
                    <ListItemText
                      primary={
                        <Typography
                          noWrap
                          sx={{
                            fontWeight: 400,
                            fontSize: "1rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {/* preserves Roboto defaults */}
                          {label}
                        </Typography>
                      }
                    />
                  )}
                </ListItemButton>
              );
            })}
          </>
        );
      }}
      Title={({ collapsed }) => (
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <NextLink href="/" passHref style={{ textDecoration: "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: "24px", height: "24px" }}>
                <AppIcon />
              </Box>

              <Typography
                variant="h6"
                color="textPrimary"
                sx={{
                  display: collapsed ? "none" : "block",
                  transition: "all 0.5s",
                }}
              >
                PAM
              </Typography>
            </Box>
          </NextLink>
        </Box>
      )}
    />
  );
};
