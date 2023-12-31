import tc from "tinycolor";

// the maximum contrast [1, 21] that this color can achieve
export function maxContrast(tiny) {
  return Math.max(tc.readability(tiny, "black"), tc.readability(tiny, "white"));
}

// TODO: refactor, remove magic contrast number, limit loops, document
export function randomColor() {
  let color;
  do {
    color = tc.random();
  } while (maxContrast(color) < 7);
  return color;
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
  let hswl = tc(tiny.getOriginalInput()).toHswl();
  let out = {};
  out.light = normalize01(contrast * (hswl.wl + 0.05) - 0.05);
  out.dark = normalize01((hswl.wl + 0.05) / contrast - 0.05);
  // this is the midpoint for brightness on the WL scale and sets the cutoff
  //  for choosing a brighter or darker color
  if (hswl.wl < 0.1791104) {
    out.best = out.light;
  } else {
    out.best = out.dark;
  }
  return out;
}

// clamp saturation or luminance to valid range [0, 1]
export function normalize01(attr) {
  return Math.max(0, Math.min(attr || 0, 1));
}
