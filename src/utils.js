import tinycolor from "tinycolor";

// this equates to the midpoint for perceived luminance on the WL scale
//  and is the best test to sort light and dark colors
const MID_RELATIVE_LUMINANCE = 0.1791104;

const bestInitialBackgroundColors = [
  // dark blue and pink
  { h: 205, s: 0.7, wl: 0.03 },
  // green and chocolate
  { h: 28, s: 0.49, wl: 0.07 },
  // dark teal and mauve
  { h: 177, s: 0.49, wl: 0.05 },
  // mint and purple
  { h: 173, s: 0.54, wl: 0.85 },
  // desaturated amber
  { h: 50, s: 0.53, wl: 0.68 },
  // desaturated dark yellow green
  { h: 85, s: 0.3, wl: 0.05 },
  // blacklight purple and orange sherbert
  { h: 264, s: 0.74, wl: 0.005 },
  // dark forest green
  { h: 124, s: 0.45, wl: 0.02 },
  // light purple and rust
  { h: 261, s: 0.2, wl: 0.87 },
  // light saturated blue and magenta
  { h: 196, s: 0.62, wl: 0.87 },
  // blood red
  { h: 357, s: 0.61, wl: 0.04 },
];

// returns a new HSWL color from combining a source color and applying the
//  transforms provided in opts
//
// hswl: { h, s, wl } => an object in the HSWL colorspace
// opts:
//   contrast: [1..21] => WCAG relative contrast that the derived color
//                         must have with the source color. Overrides any *Lum
//                         properties
//
//   adjustHue: [-180..180] => These values are added to the source color when
//   adjustSat: [-1..1]         computing the derived color. Values are clamped
//   adjustLum: [-1..1]         to their valid ranges
//
//   fixHue: [0..360] => These options fix their respective attributes to the
//   fixSat: [0..1]       provided value. If they're present they override any
//   fixLum: [0..1]       adjust* properties
export function derive(hswl, opts = {}) {
  let newHswl = { ...hswl };

  // setting hue
  if (opts.fixHue != null) {
    newHswl.h = opts.fixHue;
  } else if (opts.adjustHue != null) {
    newHswl.h = hswl.h + opts.adjustHue;
  }

  // setting saturation
  if (opts.fixSat != null) {
    newHswl.s = opts.fixSat;
  } else if (opts.adjustSat != null) {
    newHswl.s = hswl.s + opts.adjustSat;
  }

  // setting luminance
  if (opts.contrast > 1) {
    newHswl.wl = getContrastLuminance(hswl, opts.contrast).best;
  } else if (opts.fixLum != null) {
    newHswl.wl = opts.fixLum;
  } else if (opts.adjustLum != null) {
    newHswl.wl = hswl.wl + opts.adjustLum;
  }

  return normalize(newHswl);
}

// the maximum contrast [1, 21] that this color can achieve
export function maxContrast(tiny) {
  return Math.max(
    tinycolor.readability(tiny, "black"),
    tinycolor.readability(tiny, "white"),
  );
}

// returns a random color in the HSWL color space that also
//  meets specified display criteria
//
// minMaxContrast [1..21]: the minimum allowed maxContrast value that the
//                          produced color can achieve with another. This
//                          ensures that it can be paired with a readable
//                          text color
export function randomColor(minMaxContrast = 7, options = {}) {
  // color ranges are restricted to ensure the initial background colors
  //  are not too bland or fatiguing (like a full saturation green background)
  const opts = {
    h: { min: 0, max: 360 },
    s: { min: 0.2, max: 0.8 },
    wl: { min: 0.01, max: 0.8 },
    ...options,
  };

  // calculate the available luminance ranges, then select a light or dark
  //  color randomly
  const contrast = clamp(minMaxContrast, 1, 21);
  const lightColor = randomRange((contrast - 1) * 0.05, opts.wl.max);
  const darkColor = randomRange(opts.wl.min, (21 / contrast - 1) * 0.05);
  const luminance = Math.random() > 0.5 ? lightColor : darkColor;
  return {
    h: Math.round(randomRange(opts.h.min, opts.h.max)),
    s: Math.round(randomRange(opts.s.min, opts.s.max) * 100) / 100,
    wl: Math.round(luminance * 100) / 100,
  };
}

// returns a background color for the palette generator from a list of
//  colors that tested best. Used to maximize first impressions
export function randomColorFirstLoad() {
  return bestInitialBackgroundColors[
    Math.floor(Math.random() * bestInitialBackgroundColors.length)
  ];
}

// returns an object with the luminance needed to achieve the desired
//  contrast with lighter and darker colors, and the best of the two.
//
// Note that if the contrast is greater than the input color's maxContrast
//  then the resulting luminances (either 0 or 1) will only achieve the
//  maxContrast value for this color.
export function getContrastLuminance(hswl, contrast) {
  let out = {};
  out.light = normalize01(contrast * (hswl.wl + 0.05) - 0.05);
  out.dark = normalize01((hswl.wl + 0.05) / contrast - 0.05);
  out.best = isLight(hswl.wl) ? out.dark : out.light;

  return out;
}

// convert the HSWL object into a hex code string for CSS
// note: copies the input to prevent tinycolor from mutating it
export function toHex(hswl) {
  // copies hswl to prevent tinycolor from mutating it
  return tinycolor({ ...hswl }).toHexString();
}

// clamp the hswl attributes to valid values
// returns other attributes unaltered
export function normalize(hswl) {
  hswl = hswl || {};
  return {
    ...hswl,
    h: normalizeHue(hswl.h),
    s: normalize01(hswl.s),
    wl: normalize01(hswl.wl),
  };
}

// cyclically map any hue input to a valid range [0, 360]
//   120 => 120
//   375 => 15
//   -42 => 318
export function normalizeHue(hue) {
  return (((hue || 0) % -360) + 360) % 360;
}

// clamp saturation or luminance to valid range [0, 1]
export function normalize01(attr) {
  return Math.max(0, Math.min(attr || 0, 1));
}

export function isLight(luminance) {
  return luminance >= MID_RELATIVE_LUMINANCE;
}

export function isDark(luminance) {
  return isLight(luminance);
}

//
export function lerp(begin, end, val) {
  return (1 - val) * begin + val * end;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
