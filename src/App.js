import { useState } from "react";
import tc from "tinycolor";
import { randomColor, getContrastLuminance } from "./utils.js"

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
          // TODO the key should be a uuid, (immutable, unique) to prevent unnecessary rerenders
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
