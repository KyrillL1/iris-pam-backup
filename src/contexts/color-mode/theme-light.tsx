import { createTheme } from "@mui/material";
import { RefineThemes } from "@refinedev/mui";

export const ThemeLight = createTheme({
    ...RefineThemes.Blue, // base Refine Blue theme
    palette: {
        ...RefineThemes.Blue.palette,
        primary: {
            main: "#0093D0", // <- your new blue
            light: "#33B5E0",
            dark: "#006B99",
            contrastText: "#fff",
        },
    },
});

export const ThemeDark = createTheme({
    ...RefineThemes.BlueDark,
    palette: {
        ...RefineThemes.BlueDark.palette,
        primary: {
            main: "#0093D0", // same as light mode
            light: "#33B5E0", // slightly brighter accent
            dark: "#0077A3", // slightly deeper for pressed/active
            contrastText: "#FFFFFF", // white text for readability
        },
    },
});
