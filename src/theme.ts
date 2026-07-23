import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#D4AF37" },
    secondary: { main: "#5B4636" },
    error: { main: "#8C3B3B" },
    warning: { main: "#B8752C" },
    success: { main: "#4B6E52" },
    background: { default: "#FAF7F1", paper: "#FFFFFF" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "var(--font-sans), system-ui, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

export default theme;
