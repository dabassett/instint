import tinycolor from "tinycolor";

// this equates to the midpoint for percieved luminance on the WL scale
//  and is the best test to sort light and dark colors
const MID_RELATIVE_LUMINANCE = 0.1791104;

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
  return tinycolor(color.toHswl());
}

// returns an object with the luminance needed to achieve the desired
//  contrast with lighter and darker colors, and the best of the two.
//
// Note that if the contrast is greater than the input color's maxContrast
//  then the resulting luminances (either 0 or 1) will only achieve the
//  maxContrast value for this color.
export function getContrastLuminance(tiny, contrast) {
  // the variable shuffling fixes color drift that would otherwise occur when
  //  tinycolor converts between formats
  let hswl = tinycolor(tiny.getOriginalInput()).toHswl();
  let out = {};
  out.light = normalize01(contrast * (hswl.wl + 0.05) - 0.05);
  out.dark = normalize01((hswl.wl + 0.05) / contrast - 0.05);

  out.best = isLight(hswl.wl) ? out.dark : out.light;

  return out;
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
