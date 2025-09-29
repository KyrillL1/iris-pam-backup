"use client";

import { AppIcon } from "@components/app-icon";
import {
  alpha,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { RefineThemedLayoutSiderProps, ThemedSider } from "@refinedev/mui";
import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import NextLink from "next/link";
import { useMenu } from "@refinedev/core";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { myI18n, useLocale } from "@i18n/i18n-provider";
import { Link } from "@i18n/Link";

myI18n.addResourceBundle("en", "sider", { title: "PAM" });
myI18n.addResourceBundle("pt", "sider", { title: "PAM" });

NProgress.configure({
  showSpinner: false,
  minimum: 0.4,
  speed: 400,
  trickleSpeed: 60,
});

export const Sider: React.FC<RefineThemedLayoutSiderProps> = () => {
  const pathname = usePathname();
  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  useEffect(() => {
    const header = document.querySelector("header"); // or #app-bar
    const height = header?.clientHeight || 64;

    const style = document.createElement("style");
    style.innerHTML = `
    #nprogress .bar {
      top: ${height}px !important;
      height: 3px !important;
      z-index: 1000 !important;
    }
  `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const { t } = useTranslation("sider");

  return (
    <ThemedSider
      render={({ collapsed }) => {
        const { menuItems, selectedKey } = useMenu();
        return (
          <>
            {menuItems.map(({ label, route, icon, key }) => {
              return (
                <ListItemButton
                  onClick={() => {
                    NProgress.start();
                  }}
                  key={key}
                  component={Link}
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
                            fontSize: "0.9rem",
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
                {t("title")}
              </Typography>
            </Box>
          </NextLink>
        </Box>
      )}
    />
  );
};
