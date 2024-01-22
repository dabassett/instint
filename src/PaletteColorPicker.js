import { toHex, lerp, derive } from "./utils.js";
import GradientSlider from "./GradientSlider.js";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

// create the prop settings for each type of gradient slider
function getSliderSettings(swatch, id, parentHswl, dispatch) {
  const swatchColor = toHex(swatch.hswl);
  const hueGradient = getGradient(swatch.hswl, "h");
  const satGradient = getGradient(swatch.hswl, "s");
  const lumGradient = getGradient(swatch.hswl, "wl");

  const defaultSliderSettings = {
    min: 0,
    max: 1,
    step: 0.01,
    scale: x100Scale,
    color: swatchColor,
  };

  return {
    hue: {
      parent: {
        ...defaultSliderSettings,
        label: "Hue",
        max: 360,
        step: 1,
        scale: hueScale,
        value: swatch.hswl.h,
        onChange: (e) =>
          dispatch({ type: "changed_hue", id: id, value: e.target.value }),
        gradient: hueGradient,
      },

      adjust: {
        ...defaultSliderSettings,
        label: "Adjust Hue",
        min: -180,
        max: 180,
        step: 1,
        scale: hueScale,
        value: swatch.adjustHswl.h,
        onChange: (e) =>
          dispatch({
            type: "changed_adjust_hue",
            id: id,
            value: e.target.value,
          }),
        gradient: getGradient(
          swatch.hswl,
          "h",
          parentHswl.h - 180,
          parentHswl.h + 180,
        ),
      },

      fix: {
        ...defaultSliderSettings,
        label: "Fix Hue",
        min: 0,
        max: 360,
        step: 1,
        scale: hueScale,
        value: swatch.fixHswl.h,
        onChange: (e) =>
          dispatch({ type: "changed_fix_hue", id: id, value: e.target.value }),
        gradient: hueGradient,
      },
    },

    sat: {
      parent: {
        ...defaultSliderSettings,
        label: "Saturation",
        value: swatch.hswl.s,
        onChange: (e) =>
          dispatch({ type: "changed_sat", id: id, value: e.target.value }),
        gradient: satGradient,
      },

      adjust: {
        ...defaultSliderSettings,
        label: "Adjust Saturation",
        min: -parentHswl.s,
        max: 1 - parentHswl.s,
        value: swatch.adjustHswl.s,
        onChange: (e) =>
          dispatch({
            type: "changed_adjust_sat",
            id: id,
            value: e.target.value,
          }),
        gradient: satGradient,
      },

      fix: {
        ...defaultSliderSettings,
        label: "Fix Saturation",
        value: swatch.fixHswl.s,
        onChange: (e) =>
          dispatch({ type: "changed_fix_sat", id: id, value: e.target.value }),
        gradient: satGradient,
      },
    },

    lum: {
      parent: {
        ...defaultSliderSettings,
        label: "Luminance",
        value: swatch.hswl.wl,
        onChange: (e) =>
          dispatch({ type: "changed_lum", id: id, value: e.target.value }),
        gradient: lumGradient,
      },

      contrast: {
        ...defaultSliderSettings,
        label: "Contrast Ratio",
        min: 1,
        max: 21,
        step: 0.1,
        scale: (n) => n,
        value: swatch.contrast,
        onChange: (e) =>
          dispatch({ type: "changed_contrast", id: id, value: e.target.value }),
        gradient: getGradient({ ...swatch.hswl, wl: parentHswl.wl }, "con"),
      },

      adjust: {
        ...defaultSliderSettings,
        label: "Adjust Luminance",
        min: -parentHswl.wl,
        max: 1 - parentHswl.wl,
        value: swatch.adjustHswl.wl,
        onChange: (e) =>
          dispatch({
            type: "changed_adjust_lum",
            id: id,
            value: e.target.value,
          }),
        gradient: lumGradient,
      },

      fix: {
        ...defaultSliderSettings,
        label: "Fix Luminance",
        value: swatch.fixHswl.wl,
        onChange: (e) =>
          dispatch({ type: "changed_fix_lum", id: id, value: e.target.value }),
        gradient: lumGradient,
      },
    },
  };
}

// convert the display scale from 0..1 => 0..100 for saturation and
//  luminance
function x100Scale(value) {
  // round to fix floating point conversion. Math.round has numerous
  //  pitfalls documented but it's fine for this use
  return Math.round(value * 100);
}

// add the degree (°) symbol to the label
function hueScale(value) {
  return `${value}\u00b0`;
}

// generate a css gradient by varying an attribute of an HSWL
//  color while keeping the other attributes fixed
//
// attr => the color attribute to vary
//   'h' => hue,
//   's' => saturation,
//   'wl' => luminance,
//   'con' => contrast ratio with parent
//
// (note: for a contrast gradient, pass the parent's luminance in 'hswl')
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
  // sensible default interpolation ranges for each attribute type
  const rangeDefaults = {
    h: { begin: 0, end: 360 },
    s: { begin: 0, end: 1 },
    wl: { begin: 0, end: 1 },
    con: { begin: 1, end: 21 },
  };

  // allow overriding the interpolation range
  const beginVal = begin ?? rangeDefaults[attr].begin;
  const endVal = end ?? rangeDefaults[attr].end;

  // create the gradient stops in HSWL-space, this makes a nonlinear
  //  gradient that accurately represents the final computed color
  let stops = [];
  for (let i = 0; i < numStops; i++) {
    const progress = i / (numStops - 1);
    // linear interpolate the attribute's range
    const newAttr = lerp(beginVal, endVal, progress);

    const colorStop =
      attr === "con"
        ? // for contrast gradients, each stop must be derived
          toHex(derive(hswl, { contrast: newAttr }))
        : // other hswl gradients can simply be converted to rgb-space
          toHex({ ...hswl, [attr]: newAttr });

    stops.push(`${colorStop} ${progress * 100}%`);
  }

  return `linear-gradient(90deg, ${stops.join(", ")})`;
};

// generates the sliders, toggles and other controls needed to adjust the color
//  of a swatch
export default function PaletteColorPicker({
  swatch,
  swatchId,
  parentHswl,
  dispatch,
}) {
  const sliderSettings = getSliderSettings(
    swatch,
    swatchId,
    parentHswl,
    dispatch,
  );

  const hueToggleControls = {
    value: swatch.toggleOpts.h,
    onChange: (e) =>
      dispatch({
        type: "changed_hue_toggle",
        id: swatchId,
        value: e.target.value,
      }),
    exclusive: true,
    size: "small",
  };
  const satToggleControls = {
    value: swatch.toggleOpts.s,
    onChange: (e) =>
      dispatch({
        type: "changed_sat_toggle",
        id: swatchId,
        value: e.target.value,
      }),
    exclusive: true,
    size: "small",
  };
  const lumToggleControls = {
    value: swatch.toggleOpts.wl,
    onChange: (e) =>
      dispatch({
        type: "changed_lum_toggle",
        id: swatchId,
        value: e.target.value,
      }),
    exclusive: true,
    size: "small",
  };

  // render slider controls for swatches inheriting from a parent color
  if (swatch.parentId !== null) {
    const hueSliderSettings = sliderSettings.hue[swatch.toggleOpts.h];
    const satSliderSettings = sliderSettings.sat[swatch.toggleOpts.s];
    const lumSliderSettings = sliderSettings.lum[swatch.toggleOpts.wl];

    return (
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

  // render simplified swatch options when there is no parent
  return (
    <>
      <GradientSlider {...sliderSettings.hue.parent} />
      <GradientSlider {...sliderSettings.sat.parent} />
      <GradientSlider {...sliderSettings.lum.parent} />
    </>
  );
}
