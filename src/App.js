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
  const [hueSliderValue, setHueSliderValue] = useState(50);
  const [satSliderValue, setSatSliderValue] = useState(50);
  const [lumSliderValue, setLumSliderValue] = useState(50);

  let nextId = Object.keys(swatches).length;

  const handleSwatchClick = (id) => {
    const newColor = randomColor();
    const newHswl = newColor.toHswl();
    console.log(newColor.toHswl())
    setLastColor(newColor.toHexString());
    updateSwatchColor(id, newColor);
    setHueSliderValue(newHswl.h / 3.6);
    setSatSliderValue(newHswl.s * 100);
    setLumSliderValue(newHswl.wl * 100);
  };

  const handleHueSliderChange = (event, newValue) => {
    setHueSliderValue(newValue);

    // calculate new color
    const newHswl = {...swatches[0].color.getOriginalInput(), h: newValue * 3.6};
    const newColor = tinycolor(newHswl);

    updateSwatchColor(0, newColor);
  };

  const handleSatSliderChange = (event, newValue) => {
    setSatSliderValue(newValue);

    // calculate new color
    const newHswl = {...swatches[0].color.getOriginalInput(), s: newValue / 100};
    const newColor = tinycolor(newHswl);

    updateSwatchColor(0, newColor);
  };

  const handleLumSliderChange = (event, newValue) => {
    setLumSliderValue(newValue);

    // calculate new color
    const newHswl = {...swatches[0].color.getOriginalInput(), wl: newValue / 100};
    const newColor = tinycolor(newHswl);

    updateSwatchColor(0, newColor);
  };

  const updateSwatchColor = (swatchId, newColor) => {
    const nextSwatches = {
      ...swatches,
      [swatchId]: {
        ...swatches[swatchId],
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

      <GradientSlider value={hueSliderValue} gradient={getGradient(swatches[0], "h")} onChange={handleHueSliderChange} />
      <GradientSlider value={satSliderValue} gradient={getGradient(swatches[0], "s")} onChange={handleSatSliderChange} />
      <GradientSlider value={lumSliderValue} gradient={getGradient(swatches[0], "wl")} onChange={handleLumSliderChange} />
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
