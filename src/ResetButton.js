import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import RefreshIcon from "@mui/icons-material/Refresh";

// this button overlaps the element above it and will reposition
//  itself to the right side of the application at the xs breakpoint
export default function ResetButton({ ...props }) {
  return (
    <Box
      sx={{
        position: "relative",
        top: "auto",
        bottom: 0,
      }}
    >
      <Fab
        sx={{
          position: "absolute",
          zIndex: 1,
          top: -30,
          left: { xs: "auto", sm: 0 },
          right: { xs: 30, sm: 0 },
          margin: "0 auto",
        }}
        aria-label="Reset"
        {...props}
      >
        <RefreshIcon fontSize="large" />
      </Fab>
    </Box>
  );
}
