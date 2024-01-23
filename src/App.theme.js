import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: [
      "Raleway",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif"
    ].join(",",),
    fontWeightLight: 100,
    fontWeightRegular: 300,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 100,
    },
    h2: {
      fontWeight: 100,
    },
    h3: {
      fontWeight: 100,
    },
    h4: {
      fontWeight: 100,
    },
    h5: {
      fontWeight: 300,
    },
    h6: {
      fontWeight: 300,
    },
    body1: {
      fontWeight: 500,
    },
  },
  props: {
    MuiButton: {
      size: "large",
    },
    MuiButtonGroup: {
      size: "small",
    },
    MuiCheckbox: {
      size: "small",
    },
    MuiFab: {
      size: "small",
    },
    MuiFormControl: {
      margin: "dense",
      size: "small",
    },
    MuiFormHelperText: {
      margin: "dense",
    },
    MuiIconButton: {
      size: "small",
    },
    MuiInputBase: {
      margin: "dense",
    },
    MuiInputLabel: {
      margin: "dense",
    },
    MuiRadio: {
      size: "small",
    },
    MuiSwitch: {
      size: "small",
    },
    MuiTextField: {
      margin: "dense",
      size: "small",
    },
  },
  components: {

    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {}
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        }
      },
    },
  },
});

export default theme;
