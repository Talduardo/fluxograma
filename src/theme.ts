import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#6C5CE7" },
    secondary: { main: "#00B894" },
    error: { main: "#E74C3C" },
    warning: { main: "#F0932B" },
    success: { main: "#00B894" },
    background: { default: "#F6F5FB", paper: "#FFFFFF" },
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
