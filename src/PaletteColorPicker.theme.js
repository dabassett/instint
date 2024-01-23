import { createTheme } from "@mui/material/styles";

const paletteColorPickerTheme = createTheme({
  components: {
    // this stack setup allows it to switch from column to row layout on
    //  a breakpoint
    MuiStack: {
      defaultProps: {
        direction: { xs: "row", sm: "column" },
        justifyContent: { xs: "space-between", sm: "space-evenly" },
        alignItems: { xs: "center", sm: "flex-end" },
      },
    },
  },
});

export default paletteColorPickerTheme;
