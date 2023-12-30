import { useState } from "react";
import tc from "tinycolor";

export default function App() {
  // the maximum contrast [1, 21] that this color can achieve
  const maxContrast = (tiny) => {
    return Math.max(
      tc.readability(tiny, "black"),
      tc.readability(tiny, "white"),
    );
  };

  // TODO: refactor, remove magic contrast number, limit loops, document
  const randomColor = () => {
    let color;
    do {
      color = tc.random();
    } while (maxContrast(color) < 7);
    return color;
  };

  const initialSwatches = {
    0: { color: randomColor(), parentId: null, contrast: 1 },
    1: { color: randomColor(), parentId: 0, contrast: 3 },
    2: { color: randomColor(), parentId: 0, contrast: 4.5 },
  };

  // TODO looks like this is broken from being placed below
  //      other definitions, as expected
  const [lastColor, setLastColor] = useState("#000000");
  const [swatches, setSwatches] = useState(initialSwatches);

  let nextId = Object.keys(initialSwatches).length;

  // returns an object with the luminance needed to achieve the desired
  //  contrast with lighter and darker colors, and the best of the two.
  //
  // Note that if the contrast is greater than the input color's maxContrast
  //  then the resulting luminances (either 0 or 1) will only achieve the
  //  maxContrast value for this color.
  const getContrastLuminance = (tiny, contrast) => {
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
  };

  // clamp saturation or luminance to valid range [0, 1]
  const normalize01 = (attr) => {
    return Math.max(0, Math.min(attr || 0, 1));
  };

  const handleSwatchClick = (id) => {
    let newColor = randomColor();
    setLastColor(newColor.toHexString());

    const nextSwatches = {
      ...swatches,
      [id]: {
        ...swatches[id],
        color: newColor,
      },
    };

    setSwatches(() => nextSwatches);
  };

  // todo separate text tags from swatch components
  return (
    <div className="App">
      <h1>iNSTiNT</h1>
      <h2
        style={{
          color: lastColor,
        }}
      >
        Generate an entire color palette from a single input!
      </h2>

      {/* create new swatch button */}
      <button
        className="button is-primary"
        onClick={() => {
          // todo: hardcoded attributes
          const newSwatch = { color: randomColor(), parentId: 0, contrast: 7 };
          setSwatches({
            ...swatches,
            [nextId++]: newSwatch,
          });
        }}
      >
        Add Swatch
      </button>

      {Object.keys(swatches).map((id) => {
        const swatch = swatches[id];
        const parentSwatch = swatches[swatch.parentId];
        const tiny = parentSwatch?.color || swatch.color;
        let color = tiny.toHexString();

        // calculate a new color when the swatch is set to contrast its parent
        if (parentSwatch?.color && swatch.contrast > 1) {
          const lum = getContrastLuminance(tiny, swatch.contrast).best;
          const hswl = { ...tiny.toHswl(), wl: lum };
          color = tc(hswl).toHexString();
        }

        return (
          <Swatch key={id} id={id} color={color} onClick={handleSwatchClick} />
        );
      })}
    </div>
  );
}

function Swatch({ id, color, onClick }) {
  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        backgroundColor: color,
        cursor: "pointer",
      }}
      onClick={() => onClick(id)}
    ></div>
  );
}

//function AddSwatchButton({ onClick })
