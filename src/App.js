import { useState } from "react";
import { randomColor, derive, toHex } from "./utils.js";
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

const initialSwatches = {
  0: { hswl: randomColor(), parentId: null, contrast: 1 },
  1: { hswl: randomColor(), parentId: 0, contrast: 3 },
  2: { hswl: randomColor(), parentId: 0, contrast: 4.5 },
}

export default function App() {
  const [lastColor, setLastColor] = useState("#000000");
  const [selectedSwatch, setSelectedSwatch] = useState(0);
  const [swatches, setSwatches] = useState(initialSwatches);
  const [hueSliderValue, setHueSliderValue] = useState(50);
  const [satSliderValue, setSatSliderValue] = useState(50);
  const [lumSliderValue, setLumSliderValue] = useState(50);

  let nextId = Object.keys(swatches).length;

  const handleSwatchClick = (id) => {
    const newHswl = randomColor();

    setSelectedSwatch(id);
    updateSwatchColor(id, newHswl);
    setHueSliderValue(newHswl.h);
    setSatSliderValue(newHswl.s);
    setLumSliderValue(newHswl.wl);
  };

  const handleHueSliderChange = (event, newValue) => {
    setHueSliderValue(newValue);
    const newHswl = { ...swatches[0].hswl, h: newValue };
    updateSwatchColor(0, newHswl);
  };

  const handleSatSliderChange = (event, newValue) => {
    setSatSliderValue(newValue);
    const newHswl = { ...swatches[0].hswl, s: newValue };
    updateSwatchColor(0, newHswl);
  };

  const handleLumSliderChange = (event, newValue) => {
    setLumSliderValue(newValue);
    const newHswl = { ...swatches[0].hswl, wl: newValue };
    updateSwatchColor(0, newHswl);
  };

  const updateSwatchColor = (swatchId, newHswl) => {
    const nextSwatches = {
      ...swatches,
      [swatchId]: {
        ...swatches[swatchId],
        hswl: newHswl,
      },
    };

    setSwatches(() => nextSwatches);
  };

  // generate a css gradient by varying an attribute of an HSWL
  //  color while fixing the other attributes
  //
  // h == hue, s == saturation, wl == luminance
  const getGradient = (swatch, attr = "wl", numStops = 17) => {
    const hswl = swatch.hswl;
    // multiplier to correct the range based on the attribute selected
    const multiple = attr === "h" ? 360 : 1;

    // create the gradient stops in HSWL-space, this makes a nonlinear
    //  gradient that accurately represents the final computed color
    let stops = [];
    for (let i = 0; i < numStops; i++) {
      const progress = i / (numStops - 1);
      const colorStop = toHex({ ...hswl, [attr]: progress * multiple });
      stops.push(`${colorStop} ${progress * 100}%`);
    }

    return `linear-gradient(90deg, ${stops.join(", ")})`;
  };

  // convert the display scale from 0..1 => 0..100 for saturation and
  //  luminance
  function x100Scale(value) {
    return value * 100;
  }

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
        const hswl = parentSwatch?.hswl
          ? derive(parentSwatch?.hswl, { contrast: swatch.contrast })
          : swatch.hswl;
        const color = toHex(hswl);

        return (
          // TODO the key should be a uuid, (immutable, unique) to prevent unnecessary rerenders
          <Swatch key={id} id={id} color={color} onClick={handleSwatchClick} />
        );
      })}

      <GradientSlider
        value={hueSliderValue}
        min={0}
        max={360}
        gradient={getGradient(swatches[0], "h")}
        onChange={handleHueSliderChange}
      />
      <GradientSlider
        step={0.01}
        max={1}
        scale={x100Scale}
        value={satSliderValue}
        gradient={getGradient(swatches[0], "s")}
        onChange={handleSatSliderChange}
      />
      <GradientSlider
        step={0.01}
        max={1}
        scale={x100Scale}
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
