import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";

export default function Layout({ palette1, ResetButton, children, ...props }) {
  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: { backgroundColor: palette1.bgWell },
        }}
      />
      <AppBar position="static" style={{ background: palette1.background }}>
        <Toolbar variant="dense">
          <Typography variant="h1">
            <Box style={{ color: palette1.logoText1, display: "inline" }}>
              Ins
            </Box>
            <Box style={{ color: palette1.logoText2, display: "inline" }}>
              tint
            </Box>
          </Typography>
          <ResetButton />
        </Toolbar>
      </AppBar>

      {children}
    </>
  );
}
