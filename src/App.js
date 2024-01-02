import { useState } from "react";
import tinycolor from "tinycolor";
import { randomColor, derive } from "./utils.js";
import GradientSlider from "./GradientSlider.js";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
// TODO install material icons
//      https://mui.com/material-ui/getting-started/installation/#icons

// TODO when adding derived colors and reusing the input sliders in different
///      contexts, store and retrieve all values in state so that each swatch
//       retains its memory and it's easier for the user to experiment without
//       needing to worry about losing previous settings

// TODO put all swatch props in an object and pass to swatch component. Look
//       up the best practice for that

// TODO if I get around to adding inheritance chains, don't forget to traverse
//       up the tree to check for inheritance loops

export default function App() {
  const [lastColor, setLastColor] = useState("#000000");
  const [selectedSwatch, setSelectedSwatch] = useState(0);
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
    const newHswl = randomColor();

    setSelectedSwatch(id);
    //setLastColor(newColor.toHexString());
    updateSwatchColor(id, newHswl);
    setHueSliderValue(newHswl.h / 3.6);
    setSatSliderValue(newHswl.s * 100);
    setLumSliderValue(newHswl.wl * 100);
  };

  const handleHueSliderChange = (event, newValue) => {
    setHueSliderValue(newValue);
    const newHswl = { ...swatches[0].color, h: newValue * 3.6 };
    updateSwatchColor(0, newHswl);
  };

  const handleSatSliderChange = (event, newValue) => {
    setSatSliderValue(newValue);
    const newHswl = { ...swatches[0].color, s: newValue / 100 };
    updateSwatchColor(0, newHswl);
  };

  const handleLumSliderChange = (event, newValue) => {
    setLumSliderValue(newValue);
    const newHswl = { ...swatches[0].color, wl: newValue / 100 };
    updateSwatchColor(0, newHswl);
  };

  const updateSwatchColor = (swatchId, newHswl) => {
    const nextSwatches = {
      ...swatches,
      [swatchId]: {
        ...swatches[swatchId],
        color: newHswl,
      },
    };

    setSwatches(() => nextSwatches);
  };

  // generate a css gradient by varying an attribute of an HSWL
  //  color while fixing the other attributes
  //
  // h == hue, s == saturation, wl == luminance
  const getGradient = (swatch, attr = "wl", numStops = 17) => {
    const hswl = swatch.color;
    // multiplier to correct the range based on the attribute selected
    const multiple = attr === "h" ? 360 : 1;

    // create the gradient stops in HSWL-space, this makes a nonlinear
    //  gradient that accurately represents the final computed color
    let stops = [];
    for (let i = 0; i < numStops; i++) {
      const progress = i / (numStops - 1);
      const colorStop = tinycolor({ ...hswl, [attr]: progress * multiple });
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
      <Button
        variant="contained"
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
      </Button>

      {Object.keys(swatches).map((id) => {
        const swatch = swatches[id];
        const parentSwatch = swatches[swatch.parentId];
        const hswl = parentSwatch?.color
          ? derive(parentSwatch?.color, { contrast: swatch.contrast })
          : swatch.color;
        // copies hswl to prevent tinycolor from mutating it
        const color = tinycolor({...hswl}).toHexString();

        return (
          // TODO the key should be a uuid, (immutable, unique) to prevent unnecessary rerenders
          <Swatch key={id} id={id} color={color} onClick={handleSwatchClick} />
        );
      })}

      <GradientSlider
        value={hueSliderValue}
        gradient={getGradient(swatches[0], "h")}
        onChange={handleHueSliderChange}
      />
      <GradientSlider
        value={satSliderValue}
        gradient={getGradient(swatches[0], "s")}
        onChange={handleSatSliderChange}
      />
      <GradientSlider
        value={lumSliderValue}
        gradient={getGradient(swatches[0], "wl")}
        onChange={handleLumSliderChange}
      />
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
