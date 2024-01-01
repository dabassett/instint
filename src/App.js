import { useState } from "react";
import tinycolor from "tinycolor";
import { randomColor, getContrastLuminance } from "./utils.js";
import GradientSlider from "./GradientSlider.js";

// TODO install material icons
//      https://mui.com/material-ui/getting-started/installation/#icons

export default function App() {
  const [lastColor, setLastColor] = useState("#000000");
  const [swatches, setSwatches] = useState({
    0: { color: randomColor(), parentId: null, contrast: 1 },
    1: { color: randomColor(), parentId: 0, contrast: 3 },
    2: { color: randomColor(), parentId: 0, contrast: 4.5 },
  });

  let nextId = Object.keys(swatches).length;

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

  // generate a css gradient by varying an attribute of an HSWL
  //  color while fixing the other attributes
  //
  // h == hue, s == saturation, wl == luminance
  const getGradient = (swatch, attr = "wl", numStops = 17) => {
    const hswl = swatch.color.toHswl();
    // multiplier to correct the range based on the attribute selected
    const multiple = attr === "h" ? 360 : 1;

    // create the gradient stops in HSWL-space, this makes a nonlinear
    //  gradient that accurately represents the final computed color
    let stops = [];
    for (let i = 0; i < numStops; i++) {
      const progress = i / (numStops - 1);
      const colorStop = tinycolor({ ...hswl, [attr]: progress * multiple});
      stops.push(`${colorStop.toHexString()} ${progress * 100}%`);
    }

    return `linear-gradient(90deg, ${stops.join(", ")})`;
  };

  // TODO refactor
  // calculate color slider thumb positions
  const hswl = swatches[0].color.toHswl();
  const [hVal, sVal, wlVal] = [hswl.h / 3.6, hswl.s * 100, hswl.wl * 100];

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
          color = tinycolor(hswl).toHexString();
        }

        return (
          // TODO the key should be a uuid, (immutable, unique) to prevent unnecessary rerenders
          <Swatch key={id} id={id} color={color} onClick={handleSwatchClick} />
        );
      })}

      <GradientSlider value={hVal} gradient={getGradient(swatches[0], "h")} />
      <GradientSlider value={sVal} gradient={getGradient(swatches[0], "s")} />
      <GradientSlider value={wlVal} gradient={getGradient(swatches[0], "wl")} />
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
