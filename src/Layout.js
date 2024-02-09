import { useContext } from "react";

import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";

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
          {/*          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ display: { xs: "block", sm: "none" } }}
            style={{ color: palette.textA }}
          >
            <MenuIcon />
          </IconButton>*/}
          <Box sx={{ flexGrow: { xs: 0, sm: 1 } }}>
            <Typography
              variant="h1"
              style={{ color: palette.logoText1, display: "inline" }}
            >
              Ins
            </Typography>
            <Typography
              variant="h1"
              style={{ color: palette.logoText2, display: "inline" }}
            >
              tint
            </Typography>
          </Box>
          <Box sx={{ marginLeft: 2, display: { xs: "block", sm: "none" } }}>
            <IconButton
              size="large"
              aria-label="source on github"
              href="https://github.com/dabassett/instint"
              style={{ color: palette.textAAA }}
            >
              <GitHubIcon fontSize="inherit" />
            </IconButton>
          </Box>
          <Button
            variant="outlined"
            size="large"
            startIcon={<GitHubIcon />}
            sx={{ display: { xs: "none", sm: "flex" } }}
            href="https://github.com/dabassett/instint"
            style={{ color: palette.textAAA, borderColor: palette.textAAA }}
          >
            Visit Source
          </Button>
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
