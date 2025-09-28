"use client";

import { ColorModeContext } from "@contexts/color-mode";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  useActiveAuthProvider,
  useGetIdentity,
  useLogout,
  useMenu,
} from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutHeaderProps } from "@refinedev/mui";
import React, { useContext, useState } from "react";
import { Box, Divider, ListItemIcon, ListSubheader } from "@mui/material";
import {
  AccountCircle,
  AccountCircleOutlined,
  KeyboardCommandKey,
  Language,
  Logout,
} from "@mui/icons-material";
import { useKBar } from "@refinedev/kbar";
import { MZ, US } from "country-flag-icons/react/3x2";
import { useTranslation } from "react-i18next";
import { useLocale } from "@i18n/i18n-provider";

type IUser = {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
};

export const Header: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode } = useContext(ColorModeContext);
  const { data: user } = useGetIdentity<IUser>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { mutate: logout } = useLogout();
  const handleLogoutClick = () => {
    handleClose();
    logout();
  };

  const { query: { toggle: toggleCommandBar } } = useKBar();

  const { locale, changeLocale } = useLocale();
  const toggleLanguage = () => {
    if (locale === "en") {
      return changeLocale("pt");
    }
    return changeLocale("en");
  };

  return (
    <AppBar position={sticky ? "sticky" : "relative"}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: 0,
        }}
      >
        {/* Left side: HamburgerMenu */}
        <Box>
          <HamburgerMenu />
        </Box>

        {/* Right side: Theme toggle + user */}
        <Stack direction="row" spacing={1} alignItems="center">
          {user?.name && (
            <>
              <IconButton onClick={handleClick} sx={{ p: 0 }}>
                {mode === "dark"
                  ? (
                    <AccountCircle
                      sx={{ width: 32, height: 32, color: "white" }}
                    />
                  )
                  : (
                    <AccountCircleOutlined
                      sx={{ width: 32, height: 32, color: "white" }}
                    />
                  )}
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  marginTop: "4px",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                }}
              >
                <Box sx={{ paddingY: "4px" }}>
                  <Typography gutterBottom sx={{ paddingX: 1 }}>
                    {user.name}
                  </Typography>
                  <Divider />
                  <ListSubheader
                    disableGutters
                    sx={{ marginLeft: 1, backgroundColor: "transparent" }}
                  >
                    Customize
                  </ListSubheader>
                  <MenuItem onClick={() => setMode()}>
                    <ListItemIcon>
                      {mode === "dark"
                        ? <LightModeOutlined />
                        : <DarkModeOutlined />}
                    </ListItemIcon>
                    <Typography>
                      {mode === "dark"
                        ? "Select light mode"
                        : "Select dark mode"}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={toggleLanguage}>
                    <ListItemIcon>
                      {locale === "en"
                        ? <MZ style={{ marginRight: "12px" }} />
                        : <US style={{ marginRight: "12px" }} />}
                    </ListItemIcon>
                    {locale === "en"
                      ? "Language to Portuguese"
                      : "Language to English"}
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={toggleCommandBar}
                  >
                    <ListItemIcon>
                      <KeyboardCommandKey />
                    </ListItemIcon>
                    Command Bar (⌘ + K)
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogoutClick}
                  >
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Box>
              </Menu>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
