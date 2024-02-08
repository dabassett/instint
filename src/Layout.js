import { useContext } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";

import { PaletteContext } from "./Contexts.js";

export default function Layout({ children, ...props }) {
  const palette = useContext(PaletteContext);

  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: { backgroundColor: palette.bgWell },
        }}
      />
      <AppBar position="static" style={{ background: palette.background }}>
        <Toolbar>
          <Typography variant="h1">
            <Box style={{ color: palette.logoText1, display: "inline" }}>
              Ins
            </Box>
            <Box style={{ color: palette.logoText2, display: "inline" }}>
              tint
            </Box>
          </Typography>
        </Toolbar>
      </AppBar>

      {children}

      <Box
        sx={{
          marginTop: "calc(5% + 60px)",
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Box sx={{}}>
          <Typography
            variant="subtitle2"
            sx={{ marginBottom: "2rem" }}
            style={{ color: palette.bgWellTextSubtle }}
          >
            © 2024 D A Bassett
          </Typography>
        </Box>
      </Box>
    </>
  );
}
