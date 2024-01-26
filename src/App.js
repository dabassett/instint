import { useState, useReducer } from "react";

import { ThemeProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import theme from "./App.theme.js";
import { randomColor, derive, toHex } from "./utils.js";
import Swatch from "./Swatch.js";
import PaletteColorPicker from "./PaletteColorPicker.js";

// TODO install material icons
//      https://mui.com/material-ui/getting-started/installation/#icons

// TODO swatch keys should be a uuid, (immutable, unique) to prevent unnecessary rerenders

// TODO - if I get around to adding inheritance chains, don't forget to traverse
//         up the tree to check for inheritance cycles
//        - could also detect cycles by counting, if the count
//      - also, inheritance will require some restructuring, as there are problems
//         with ordering in the render stage
//        - if a root swatch is updated, then descendent swatches must be
//           updated in order of their depedency since their results depend on
//           on the immediate parent
//        - solution: store derived colors in state, rather than calculating
//           in the render stage. Store child ids and use a queue to process
//           new colors in the correct order

// TODO when deleting a swatch with children set the children's native colors
//       to their current derived colors to prevent them from changing suddenly
//       and inform them with a small infobox

// TODO features
// - warning icons and descriptions when colors don't satisfy contrast requirements
// - swatch names
//   - then, create the palette object in a constructor, building from the existing names
//     and programmatically assign names and non-swatch colors
// - palette dump to plaintext css and json
// - multiple palettes for more page variety
// - configurable inheritance

const swatchDefaults = () => {
  return {
    // this swatch's hue, saturation and WCAG luminance
    hswl: { h: 0, s: 0, wl: 0 },
    // inherit one or more color attribute from this swatch
    parentId: null,
    // attempt to achieve this contrast ratio with parent swatch
    contrast: 1,
    // add these values to the parent swatch's attributes
    adjustHswl: { h: 0, s: 0, wl: 0 },
    // statically set the values for these attributes (ie they will ignore the
    //  parent's settings)
    fixHswl: { h: 0, s: 0, wl: 0 },
    // toggles which configuration options to use when deriving the swatch's
    //  final color
    toggleOpts: { h: "adjust", s: "adjust", wl: "contrast" },
  };
};

// configure the initial swatches, child swatch colors will be calculated from
//  their parent swatch
const setupInit = {
  0: { ...swatchDefaults(), hswl: randomColor() },
  1: { ...swatchDefaults(), parentId: "0", contrast: 3.5 },
  2: { ...swatchDefaults(), parentId: "0", contrast: 5 },
  3: { ...swatchDefaults(), parentId: "0", contrast: 7 },
  4: {
    ...swatchDefaults(),
    parentId: "0",
    contrast: 2,
    adjustHswl: { h: 20, s: -0.4, wl: 0 },
  },
  5: {
    ...swatchDefaults(),
    parentId: "4",
    contrast: 4.5,
    adjustHswl: { h: 0, s: 0.1, wl: 0 },
  },
  6: {
    ...swatchDefaults(),
    parentId: "4",
    contrast: 3,
    adjustHswl: { h: 90, s: 0.3, wl: 0 },
  },
  7: { ...swatchDefaults(), parentId: "6", contrast: 5 },
};

// compute swatches for the first render
const initialSwatches = reducer(setupInit, {
  type: "derive_children",
  id: "0",
});

// transform the swatch's state into options for utils.derive
function swatchOptions(swatch) {
  let options = {};
  // return early when there is no parent set. The swatch will not have
  //  its color changed
  if (swatch.parentId == null) return options;

  // set hue options
  switch (swatch.toggleOpts.h) {
    case "adjust":
      options.adjustHue = swatch.adjustHswl.h;
      break;
    case "fix":
      options.fixHue = swatch.fixHswl.h;
      break;
    default:
      throw new RangeError(`Unrecognized hue option '${swatch.toggleOpts.h}'`);
  }

  // set saturation options
  switch (swatch.toggleOpts.s) {
    case "adjust":
      options.adjustSat = swatch.adjustHswl.s;
      break;
    case "fix":
      options.fixSat = swatch.fixHswl.s;
      break;
    default:
      throw new RangeError(
        `Unrecognized saturation option '${swatch.toggleOpts.s}'`,
      );
  }

  // set luminance options
  switch (swatch.toggleOpts.wl) {
    case "contrast":
      options.contrast = swatch.contrast;
      break;
    case "adjust":
      options.adjustLum = swatch.adjustHswl.wl;
      break;
    case "fix":
      options.fixLum = swatch.fixHswl.wl;
      break;
    default:
      throw new RangeError(
        `Unrecognized saturation option '${swatch.toggleOpts.wl}'`,
      );
  }

  return options;
}

function deriveChildColors(swatchId, nextSwatches) {
  const newSwatch = nextSwatches[swatchId];
  if (newSwatch.parentId !== null) {
    newSwatch.hswl = derive(
      nextSwatches[newSwatch.parentId].hswl,
      swatchOptions(newSwatch),
    );
  }

  Object.keys(nextSwatches).forEach((id) => {
    if (nextSwatches[id].parentId === swatchId) {
      nextSwatches = deriveChildColors(id, nextSwatches);
    }
  });

  return nextSwatches;
}

function reducer(swatches, action) {
  let nextSwatch = { ...swatches[action.id] };

  switch (action.type) {
    case "derive_children":
      // used during init to calculate the dependent swatch color
      break;
    case "changed_hue":
      nextSwatch.hswl.h = action.value;
      break;
    case "changed_sat":
      nextSwatch.hswl.s = action.value;
      break;
    case "changed_lum":
      nextSwatch.hswl.wl = action.value;
      break;
    case "changed_adjust_hue":
      nextSwatch.adjustHswl.h = action.value;
      break;
    case "changed_adjust_sat":
      nextSwatch.adjustHswl.s = action.value;
      break;
    case "changed_adjust_lum":
      nextSwatch.adjustHswl.wl = action.value;
      break;
    case "changed_fix_hue":
      nextSwatch.fixHswl.h = action.value;
      break;
    case "changed_fix_sat":
      nextSwatch.fixHswl.s = action.value;
      break;
    case "changed_fix_lum":
      nextSwatch.fixHswl.wl = action.value;
      break;
    case "changed_contrast":
      nextSwatch.contrast = action.value;
      break;
    case "changed_hue_toggle":
      if (action.value === null) return;
      nextSwatch.toggleOpts.h = action.value;
      break;
    case "changed_sat_toggle":
      if (action.value === null) return;
      nextSwatch.toggleOpts.s = action.value;
      break;
    case "changed_lum_toggle":
      if (action.value === null) return;
      nextSwatch.toggleOpts.wl = action.value;
      break;
    case "random_color":
      // randomizes most color attributes of both parent and child swatches
      //  contrast is never randomized so element visibility is not affected
      //
      // .hswl is used by parent swatches, and is restricted by default to
      //   produce better results
      nextSwatch.hswl = randomColor();
      // fix and adjust are only used by child swatches, so we can use the
      //  full color space
      nextSwatch.fixHswl = randomColor(1, {
        s: { min: 0, max: 1 },
        wl: { min: 0, max: 1 },
      });
      // attributes set to "adjust" depend on the parent swatch and must be
      //  set to the correct ranges to prevent display issues with the sliders
      nextSwatch.adjustHswl = randomColor(1, {
        h: { min: -180, max: 180 },
        s: { min: -0.3, max: 0.3 },
        wl: { min: -0.3, max: 0.3 },
      });
      break;
    case "new_swatch":
      // TODO hardcoded attributes
      nextSwatch = {
        ...swatchDefaults(),
        color: randomColor(),
        parentId: "0",
      };
      break;

    default:
      throw Error("Unknown action: " + action.type);
  }

  let nextSwatches = {
    ...swatches,
    [action.id]: nextSwatch,
  };
  nextSwatches = deriveChildColors(action.id, nextSwatches);
  return nextSwatches;
}

export default function App() {
  const [swatchId, setSwatchId] = useState("0");
  const [swatches, dispatch] = useReducer(reducer, initialSwatches);

  const activeSwatch = swatches[swatchId];
  const activeParent = swatches[activeSwatch.parentId];
  const parentHswl = {
    ...{ h: 0, s: 0, wl: 0 },
    ...activeParent?.hswl,
  };

  const palette1 = {
    background: toHex(swatches["0"].hswl),
    textA: toHex(swatches["1"].hswl),
    textAA: toHex(swatches["2"].hswl),
    textAAA: toHex(swatches["3"].hswl),
    bgWell: toHex(swatches["4"].hswl),
    bgWellText: toHex(swatches["5"].hswl),
    button: toHex(swatches["6"].hswl),
    buttonText: toHex(swatches["7"].hswl),
    // these derived colors are used in minor interface details and so are
    //  excluded from the user's swatches to reduce clutter
    buttonDisabled: toHex(swatches["4"].hswl),
    buttonTextDisabled: toHex(derive(swatches["4"].hswl, { contrast: 3 })),
    logoText1: toHex(derive(swatches["4"].hswl, { contrast: 3, adjustSat: 0.3 })),
    logoText2: toHex(derive(swatches["4"].hswl, { contrast: 3.3, adjustSat: 0.4, adjustHue: 110 })),
  };
  let nextId = Object.keys(swatches).length;

  const handleSwatchClick = (id) => {
    setSwatchId(id);
  };

  const handleNewSwatchClick = () => {
    dispatch({ type: "new_swatch", id: (nextId++).toString() });
  };

  // TODO separate text tags from swatch components
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: { backgroundColor: palette1.bgWell },
        }}
      />

      <Typography variant="h1" gutterBottom >
        <Box style={{color: palette1.logoText1, display: "inline"}}>Ins</Box>
        <Box style={{color: palette1.logoText2, display: "inline"}}>tint</Box>
      </Typography>

      <Card
        variant="outlined"
        sx={{ width: "100%" }}
        style={{
          background: palette1.background,
          border: `1px ${palette1.textAAA} solid`,
          outline: `1px ${palette1.textA} solid`,
        }}
      >
        <CardContent>
          <Typography
            variant="h2"
            style={{
              color: palette1.textA,
            }}
            gutterBottom
          >
            Welcome to Instint!
          </Typography>
          <Typography
            variant="h5"
            style={{
              color: palette1.textAA,
            }}
            gutterBottom
          >
            Here to help designers pair text and background colors that are both
            beautiful and easy to read
          </Typography>
          <Typography
            variant="body1"
            style={{
              color: palette1.textAAA,
            }}
            gutterBottom
          >
            Instint can take any color and generate analogous colors that
            satisfy WCAG 2.1 contrast ratio requirements. This means that you no
            longer need to fiddle with finicky formulae to create perfect color
            palettes.
          </Typography>
        </CardContent>
      </Card>

      {/* randomize button */}
      <Button
        variant="contained"
        onClick={(e) => dispatch({ type: "random_color", id: swatchId })}
        style={{ background: palette1.button, color: palette1.buttonText }}
      >
        Randomize Color
      </Button>

      {/* new swatch button */}
      <Button
        variant="contained"
        onClick={handleNewSwatchClick}
        style={{ background: palette1.button, color: palette1.buttonText }}
      >
        Add Swatch
      </Button>

      {/* swatches */}
      <Grid
        container
        rowSpacing={0.6}
        columnSpacing={0.7}
        sx={{ margin: "15px 0" }}
      >
        {Object.keys(swatches).map((id) => {
          return (
            <Grid key={id} xs={4} sm={3} md={2} xl={1}>
              <Swatch
                id={id}
                hswl={swatches[id].hswl}
                active={id === swatchId}
                onClick={handleSwatchClick}
              />
            </Grid>
          );
        })}
      </Grid>

      <PaletteColorPicker
        swatch={activeSwatch}
        swatchId={swatchId}
        parentHswl={parentHswl}
        palette={palette1}
        dispatch={dispatch}
      />
    </ThemeProvider>
  );
}
