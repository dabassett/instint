import { useState } from "react";
import { randomColor, derive, toHex } from "./utils.js";
import GradientSlider from "./GradientSlider.js";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
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

// TODO NEXT
// make sliders and toggles for the adjustment settings
//   swatch state controls conditional rendering
//   handlers to set state
//   pass to derive in an options object
//     need derive refactor for names
// getGradient need an options map for the new settings and to use derive
// swatch generation needs to reflect the change

const swatchDefaults = {
  hswl: { h: 0, s: 0, wl: 0 },
  parentId: null,
  contrast: 1,
  adjustHswl: { h: 0, s: 0, wl: 0 },
  fixHswl: { h: 0, s: 0, wl: 0 },
  toggle: { h: "adj", s: "adj", wl: "adj" },
};

const initialSwatches = {
  0: { ...swatchDefaults, hswl: randomColor() },
  1: { ...swatchDefaults, parentId: 0, contrast: 3 },
  2: { ...swatchDefaults, parentId: 0, contrast: 4.5 },
  3: { ...swatchDefaults, parentId: 0, contrast: 7 },
};

export default function App() {
  const [selectedSwatch, setSelectedSwatch] = useState(0);
  const [swatches, setSwatches] = useState(initialSwatches);

  const activeSwatch = swatches[selectedSwatch];
  const activeColor = activeSwatch?.hswl ?? swatchDefaults.hswl;
  // TODO derive and child color updates should be happening in the change handler
  const bgColor = swatches[0]?.hswl ?? swatchDefaults.hswl;
  const textAColor = derive(bgColor, { contrast: swatches[1].contrast });
  const textAAColor = derive(bgColor, { contrast: swatches[2].contrast });
  const textAAAColor = derive(bgColor, { contrast: swatches[3].contrast });
  let nextId = Object.keys(swatches).length;

  const handleSwatchClick = (id) => {
    setSelectedSwatch(id);
  };

  const handleRandomizeClick = (event) => {
    updateSwatchColor(selectedSwatch, randomColor());
  };

  const handleHueSliderChange = (event, newValue) => {
    const newHswl = { ...swatches[selectedSwatch].hswl, h: event.target.value };
    updateSwatchColor(selectedSwatch, newHswl);
  };

  const handleSatSliderChange = (event, newValue) => {
    const newHswl = { ...swatches[selectedSwatch].hswl, s: event.target.value };
    updateSwatchColor(selectedSwatch, newHswl);
  };

  const handleLumSliderChange = (event, newValue) => {
    const newHswl = {
      ...swatches[selectedSwatch].hswl,
      wl: event.target.value,
    };
    updateSwatchColor(selectedSwatch, newHswl);
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
  const getGradient = (hswl, attr = "wl", numStops = 17) => {
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
    // round to fix floating point conversion. Math.round has numerous
    //  pitfalls documented but it's fine for this use
    return Math.round(value * 100);
  }

  // Add the degree (°) symbol to the label
  function hueScale(value) {
    return `${value}\u00b0`;
  }

  // todo separate text tags from swatch components
  return (
    <div className="App">
      <h1>Instint</h1>

      <Card
        variant="outlined"
        sx={{ minWidth: 275, width: 500 }}
        style={{
          background: toHex(bgColor),
          border: `1px ${toHex(textAAAColor)} solid`,
          outline: `1px ${toHex(textAColor)} solid`,
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 28 }} color={toHex(textAColor)} gutterBottom>
            Welcome to Instint!
          </Typography>
          <Typography sx={{ fontSize: 18 }} color={toHex(textAAColor)} gutterBottom>
            Here to help designers pair text and background colors that are both beautiful and easy to read
          </Typography>
          <Typography sx={{ fontSize: 14 }} color={toHex(textAAAColor)} gutterBottom>
            Instint can take any color and generate analogous colors that satisfy WCAG 2.1 contrast ratio requirements. This means that you no longer need to fiddle with finicky formulae to create perfect color palettes.
          </Typography>
        </CardContent>
      </Card>

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

      <Button variant="contained" onClick={handleRandomizeClick}>
        Randomize Color
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
        min={0}
        max={360}
        step={1}
        label="Hue"
        scale={hueScale}
        value={activeColor.h}
        gradient={getGradient(activeColor, "h")}
        onChange={handleHueSliderChange}
      />
      <GradientSlider
        min={0}
        max={1}
        step={0.01}
        label="Saturation"
        scale={x100Scale}
        value={activeColor.s}
        gradient={getGradient(activeColor, "s")}
        onChange={handleSatSliderChange}
      />
      <GradientSlider
        min={0}
        max={1}
        step={0.01}
        label="Luminance"
        scale={x100Scale}
        value={activeColor.wl}
        gradient={getGradient(activeColor, "wl")}
        onChange={handleLumSliderChange}
      />
      <GradientSlider
        min={-180}
        max={180}
        step={1}
        label="Adjust Hue"
        scale={hueScale}
        value={activeSwatch.adjustHswl.h}
        gradient={getGradient(activeColor, "h")}
        onChange={handleHueSliderChange}
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
