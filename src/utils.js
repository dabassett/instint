import tinycolor from "tinycolor";

// this equates to the midpoint for percieved luminance on the WL scale
//  and is the best test to sort light and dark colors
const MID_RELATIVE_LUMINANCE = 0.1791104;

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
  if (opts.fixHue) {
    newHswl.h = opts.fixHue;
  } else if (opts.adjustHue) {
    newHswl.h = hswl.h + opts.adjustHue;
  }

  // setting saturation
  if (opts.fixSat) {
    newHswl.s = opts.fixSat;
  } else if (opts.adjustSat) {
    newHswl.s = hswl.s + opts.adjustSat;
  }

  // setting luminance
  if (opts.contrast > 1) {
    newHswl.wl = getContrastLuminance(hswl, opts.contrast).best;
  } else if (opts.fixLum) {
    newHswl.wl = opts.fixLum;
  } else if (opts.adjustLum) {
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

// TODO: refactor, limit loops, document
//
//       this will be called with user inputs, clamp the param
//
//       instead of looping, calculate the acceptable WL range from
//        minRequiredContrast and make a random selection from that
//
//       returning hswl to try to prevent color drift, switching to
//       hswl random would simplify this issue
export function randomColor(minPossibleContrast = 7) {
  let color;
  do {
    color = tinycolor.random();
  } while (maxContrast(color) < minPossibleContrast);
  return color.toHswl();
}

// returns an object with the luminance needed to achieve the desired
//  contrast with lighter and darker colors, and the best of the two.
//
// Note that if the contrast is greater than the input color's maxContrast
//  then the resulting luminances (either 0 or 1) will only achieve the
//  maxContrast value for this color.
export function getContrastLuminance(hswl, contrast) {
  let out = {};
  // TODO test contrast * (hswl.wl + 0.05) - (0.05 * contrast)
  //       and the inverse for dark
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
