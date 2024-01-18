import { useState } from "react";
import { randomColor, derive, toHex, lerp } from "./utils.js";
import GradientSlider from "./GradientSlider.js";
import Swatch from "./Swatch.js";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
// TODO install material icons
//      https://mui.com/material-ui/getting-started/installation/#icons

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
// - swatches display hex codes
// - palette dump to plaintext css and json
// - multiple palettes for more page variety
// - configurable inheritance

const swatchDefaults = {
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

const initialSwatches = {
  0: { ...swatchDefaults, hswl: randomColor() },
  1: { ...swatchDefaults, parentId: "0", contrast: 3.5 },
  2: { ...swatchDefaults, parentId: "0", contrast: 5 },
  3: { ...swatchDefaults, parentId: "0", contrast: 7 },
};

export default function App() {
  const [selectedSwatch, setSelectedSwatch] = useState("0");
  const [swatches, setSwatches] = useState(initialSwatches);

  const activeSwatch = swatches[selectedSwatch];
  const activeParent = swatches[activeSwatch.parentId];
  const parentHswl = {
    ...{ h: 0, s: 0, wl: 0 },
    ...activeParent?.hswl,
  };

  // TODO derive and child color updates should be happening in the change handler
  const bgColor = swatches["0"]?.hswl ?? swatchDefaults.hswl;
  const textAColor = swatches["1"]?.hswl ?? swatchDefaults.hswl;
  const textAAColor = swatches["2"]?.hswl ?? swatchDefaults.hswl;
  const textAAAColor = swatches["3"]?.hswl ?? swatchDefaults.hswl;
  let nextId = Object.keys(swatches).length;

  const handleSwatchClick = (id) => {
    setSelectedSwatch(id);
  };

  const handleRandomizeClick = (event) => {
    updateSwatchSettings(selectedSwatch, { hswl: randomColor() });
  };

  const handleHueSliderChange = (event, newValue) => {
    const newHswl = { ...swatches[selectedSwatch].hswl, h: event.target.value };
    updateSwatchSettings(selectedSwatch, { hswl: newHswl });
  };

  const handleSatSliderChange = (event, newValue) => {
    const newHswl = { ...swatches[selectedSwatch].hswl, s: event.target.value };
    updateSwatchSettings(selectedSwatch, { hswl: newHswl });
  };

  const handleLumSliderChange = (event, newValue) => {
    const newHswl = {
      ...swatches[selectedSwatch].hswl,
      wl: event.target.value,
    };
    updateSwatchSettings(selectedSwatch, { hswl: newHswl });
  };

  const handleHueAdjSliderChange = (event, newValue) => {
    const newAdjHswl = {
      ...swatches[selectedSwatch].adjustHswl,
      h: event.target.value,
    };
    updateSwatchSettings(selectedSwatch, { adjustHswl: newAdjHswl });
  };

  const handleSatAdjSliderChange = (event, newValue) => {
    const newAdjHswl = {
      ...swatches[selectedSwatch].adjustHswl,
      s: event.target.value,
    };
    updateSwatchSettings(selectedSwatch, { adjustHswl: newAdjHswl });
  };

  const handleLumAdjSliderChange = (event, newValue) => {
    const newAdjHswl = {
      ...swatches[selectedSwatch].adjustHswl,
      wl: event.target.value,
    };
    updateSwatchSettings(selectedSwatch, { adjustHswl: newAdjHswl });
  };

  const handleHueFixSliderChange = (event, newValue) => {
    const newFixHswl = {
      ...swatches[selectedSwatch].fixHswl,
      h: event.target.value,
    };
    updateSwatchSettings(selectedSwatch, { fixHswl: newFixHswl });
  };

  const handleSatFixSliderChange = (event, newValue) => {
    const newFixHswl = {
      ...swatches[selectedSwatch].fixHswl,
      s: event.target.value,
    };
    updateSwatchSettings(selectedSwatch, { fixHswl: newFixHswl });
  };

  const handleLumFixSliderChange = (event, newValue) => {
    const newFixHswl = {
      ...swatches[selectedSwatch].fixHswl,
      wl: event.target.value,
    };
    updateSwatchSettings(selectedSwatch, { fixHswl: newFixHswl });
  };

  const handleContrastSliderChange = (event, newValue) => {
    updateSwatchSettings(selectedSwatch, { contrast: newValue });
  };

  const handleHueToggleChange = (event, newValue) => {
    if (newValue === null) return;

    const newToggleOpts = {
      ...activeSwatch.toggleOpts,
      h: newValue,
    };

    updateSwatchSettings(selectedSwatch, { toggleOpts: newToggleOpts });
  };

  const handleSatToggleChange = (event, newValue) => {
    if (newValue === null) return;

    const newToggleOpts = {
      ...activeSwatch.toggleOpts,
      s: newValue,
    };

    updateSwatchSettings(selectedSwatch, { toggleOpts: newToggleOpts });
  };

  const handleLumToggleChange = (event, newValue) => {
    if (newValue === null) return;

    const newToggleOpts = {
      ...activeSwatch.toggleOpts,
      wl: newValue,
    };

    updateSwatchSettings(selectedSwatch, { toggleOpts: newToggleOpts });
  };

  const updateSwatchSettings = (swatchId, newAttributes) => {
    // update the changed swatch attributes
    let nextSwatches = {
      ...swatches,
      [swatchId]: {
        ...swatches[swatchId],
        ...newAttributes,
      },
    };

    nextSwatches = deriveChildColors(swatchId, nextSwatches);

    setSwatches(nextSwatches);
  };

  const deriveChildColors = (swatchId, nextSwatches) => {
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
  };

  // generate a css gradient by varying an attribute of an HSWL
  //  color while fixing the other attributes
  //
  // attr => the hswl attribute to vary
  //   'h'  == hue,
  //   's'  == saturation,
  //   'wl' == luminance
  //
  // begin => starting value of the gradient
  // end   => final value of the gradient
  // numStops => number of color stops in the returned gradient
  const getGradient = (
    hswl,
    attr = "wl",
    begin = null,
    end = null,
    numStops = 16,
  ) => {
    // sensible default interpolation ranges for each attribute
    const rangeDefaults = {
      h: { begin: 0, end: 360 },
      s: { begin: 0, end: 1 },
      wl: { begin: 0, end: 1 },
    };
    // multiplier to correct the range based on the attribute selected
    const beginVal = begin ?? rangeDefaults[attr].begin;
    const endVal = end ?? rangeDefaults[attr].end;

    // create the gradient stops in HSWL-space, this makes a nonlinear
    //  gradient that accurately represents the final computed color
    let stops = [];
    for (let i = 0; i < numStops; i++) {
      const progress = i / (numStops - 1);
      const colorStop = toHex({
        ...hswl,
        [attr]: lerp(beginVal, endVal, progress),
      });
      stops.push(`${colorStop} ${progress * 100}%`);
    }

    return `linear-gradient(90deg, ${stops.join(", ")})`;
  };

  // convert the display scale from 0..1 => 0..100 for saturation and
  //  luminance
  function x100Scale(value) {
    // round to fix floating point conversion. Math.round has numerous
    //  pitfalls documented but it's fine for this use
    return Math.round(value * 100);
  }

  // Add the degree (°) symbol to the label
  function hueScale(value) {
    return `${value}\u00b0`;
  }

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
        throw new RangeError(
          `Unrecognized hue option '${swatch.toggleOpts.h}'`,
        );
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

  // generates the sliders, toggles and other controls for the
  //  selected swatch
  const PaletteSliders = () => {
    // set default slider settings
    let hueSliderSettings = {
      min: 0,
      max: 360,
      step: 1,
      label: "Hue",
      scale: hueScale,
      value: activeSwatch.hswl.h,
      gradient: getGradient(activeSwatch.hswl, "h"),
      onChange: handleHueSliderChange,
    };

    let satSliderSettings = {
      min: 0,
      max: 1,
      step: 0.01,
      label: "Saturation",
      scale: x100Scale,
      value: activeSwatch.hswl.s,
      gradient: getGradient(activeSwatch.hswl, "s"),
      onChange: handleSatSliderChange,
    };

    let lumSliderSettings = {
      min: 0,
      max: 1,
      step: 0.01,
      label: "Luminance",
      scale: x100Scale,
      value: activeSwatch.hswl.wl,
      gradient: getGradient(activeSwatch.hswl, "wl"),
      onChange: handleLumSliderChange,
    };

    let sliders = (
      <>
        <GradientSlider {...hueSliderSettings} />
        <GradientSlider {...satSliderSettings} />
        <GradientSlider {...lumSliderSettings} />
      </>
    );

    if (activeSwatch.parentId !== null) {
      const hueToggleControls = {
        value: activeSwatch.toggleOpts.h,
        onChange: handleHueToggleChange,
        exclusive: true,
        size: "small",
      };
      const satToggleControls = {
        value: activeSwatch.toggleOpts.s,
        onChange: handleSatToggleChange,
        exclusive: true,
        size: "small",
      };
      const lumToggleControls = {
        value: activeSwatch.toggleOpts.wl,
        onChange: handleLumToggleChange,
        exclusive: true,
        size: "small",
      };

      switch (activeSwatch.toggleOpts.h) {
        case "adjust":
          hueSliderSettings = {
            ...hueSliderSettings,
            min: -180,
            max: 180,
            label: "Adjust Hue",
            value: activeSwatch.adjustHswl.h,
            onChange: handleHueAdjSliderChange,
            gradient: getGradient(
              activeSwatch.hswl,
              "h",
              parentHswl.h - 180,
              parentHswl.h + 180,
            ),
          };
          break;
        case "fix":
          hueSliderSettings = {
            ...hueSliderSettings,
            label: "Fix Hue",
            value: activeSwatch.fixHswl.h,
            onChange: handleHueFixSliderChange,
          };
          break;
        default:
          throw new RangeError(
            `Unrecognized hue option '${activeSwatch.toggleOpts.h}'`,
          );
      }

      switch (activeSwatch.toggleOpts.s) {
        case "adjust":
          satSliderSettings = {
            ...satSliderSettings,
            min: -parentHswl.s,
            max: 1 - parentHswl.s,
            label: "Adjust Saturation",
            value: activeSwatch.adjustHswl.s,
            onChange: handleSatAdjSliderChange,
          };
          break;
        case "fix":
          satSliderSettings = {
            ...satSliderSettings,
            label: "Fix Saturation",
            value: activeSwatch.fixHswl.s,
            onChange: handleSatFixSliderChange,
          };
          break;
        default:
          throw new RangeError(
            `Unrecognized saturation option '${activeSwatch.toggleOpts.s}'`,
          );
      }

      switch (activeSwatch.toggleOpts.wl) {
        case "adjust":
          lumSliderSettings = {
            ...lumSliderSettings,
            min: -parentHswl.wl,
            max: 1 - parentHswl.wl,
            label: "Adjust Luminance",
            value: activeSwatch.adjustHswl.wl,
            onChange: handleLumAdjSliderChange,
          };
          break;
        case "fix":
          lumSliderSettings = {
            ...lumSliderSettings,
            label: "Fix Luminance",
            value: activeSwatch.fixHswl.wl,
            onChange: handleLumFixSliderChange,
          };
          break;
        case "contrast":
          lumSliderSettings = {
            ...lumSliderSettings,
            min: 1,
            max: 21,
            step: 0.1,
            scale: (n) => n,
            label: "Contrast Ratio",
            value: activeSwatch.contrast,
            onChange: handleContrastSliderChange,
          };
          break;
        default:
          throw new RangeError(
            `Unrecognized luminance option '${activeSwatch.toggleOpts.wl}'`,
          );
      }

      sliders = (
        <>
          <ToggleButtonGroup {...hueToggleControls}>
            <ToggleButton value="adjust">Adj</ToggleButton>
            <ToggleButton value="fix">Fix</ToggleButton>
          </ToggleButtonGroup>

          <GradientSlider {...hueSliderSettings} />

          <ToggleButtonGroup {...satToggleControls}>
            <ToggleButton value="adjust">Adj</ToggleButton>
            <ToggleButton value="fix">Fix</ToggleButton>
          </ToggleButtonGroup>

          <GradientSlider {...satSliderSettings} />

          <ToggleButtonGroup {...lumToggleControls}>
            <ToggleButton value="contrast">Contrast</ToggleButton>
            <ToggleButton value="adjust">Adj</ToggleButton>
            <ToggleButton value="fix">Fix</ToggleButton>
          </ToggleButtonGroup>

          <GradientSlider {...lumSliderSettings} />
        </>
      );
    }

    return sliders;
  };

  // todo separate text tags from swatch components
  return (
    <div className="App">
      <h1>Instint</h1>

      <Card
        variant="outlined"
        sx={{ minWidth: 275, width: 500 }}
        style={{
          background: toHex(bgColor),
          border: `1px ${toHex(textAAAColor)} solid`,
          outline: `1px ${toHex(textAColor)} solid`,
        }}
      >
        <CardContent>
          <Typography
            sx={{ fontSize: 28 }}
            style={{
              color: toHex(textAColor),
            }}
            gutterBottom
          >
            Welcome to Instint!
          </Typography>
          <Typography
            sx={{ fontSize: 18 }}
            style={{
              color: toHex(textAAColor),
            }}
            gutterBottom
          >
            Here to help designers pair text and background colors that are both
            beautiful and easy to read
          </Typography>
          <Typography
            sx={{ fontSize: 14 }}
            style={{
              color: toHex(textAAAColor),
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

      {/* create new swatch button */}
      <Button
        variant="contained"
        onClick={() => {
          // todo: hardcoded attributes
          const newSwatch = {
            ...swatchDefaults,
            color: randomColor(),
            parentId: "0",
            contrast: 7,
          };
          setSwatches({
            ...swatches,
            [(nextId++).toString()]: newSwatch,
          });
        }}
      >
        Add Swatch
      </Button>

      <Button variant="contained" onClick={handleRandomizeClick}>
        Randomize Color
      </Button>

      {Object.keys(swatches).map((id) => {
        return (
          // TODO the key should be a uuid, (immutable, unique) to prevent unnecessary rerenders
          <Swatch
            key={id}
            id={id}
            hswl={swatches[id].hswl}
            onClick={handleSwatchClick}
          />
        );
      })}

      {PaletteSliders()}
    </div>
  );
}
