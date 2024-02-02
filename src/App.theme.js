import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const defaults = {
  borderRadius: 2,
};

let theme = createTheme({
  spacing: 8,
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
    fontFamily: ["Raleway", '"Helvetica Neue"', "Arial", "sans-serif"].join(
      ",",
    ),
    fontWeightLight: 100,
    fontWeightRegular: 300,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 100,
    },
    h2: {
      fontWeight: 200,
    },
    h3: {
      fontWeight: 200,
    },
    h4: {
      fontWeight: 300,
    },
    h5: {
      fontWeight: 400,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      // fontSize: 17,
      fontWeight: 500,
    },
    body2: {
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
        root: {},
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: defaults.borderRadius,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: defaults.borderRadius,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
