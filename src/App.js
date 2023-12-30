import { useState } from "react";
import tc from "tinycolor";

const randomColor = () => {
  // let hex_color = Math
  //   .floor(Math.random()*16777215)
  //   .toString(16)
  //   .padStart(6, '0');
  // return `#${hex_color}`;
  return tc.random().toHexString();
};

const initialSwatches = {
  0: { color: randomColor(), parentId: null },
};

let nextId = Object.keys(initialSwatches).length;

export default function App() {
  const [lastColor, setLastColor] = useState("#000000");
  const [swatches, setSwatches] = useState(initialSwatches);

  const handleSwatchClick = (id) => {
    let newColor = randomColor();
    setLastColor(newColor);

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

      <button
        className="button is-primary"
        onClick={() => {
          // todo: hardcoded attributes
          const newSwatch = { color: "#00ff00", parentId: 0 };
          setSwatches({
            ...swatches,
            [nextId++]: newSwatch,
          });
        }}
      >
        Add Swatch
      </button>

      {Object.keys(swatches).map((id) => (
        <Swatch
          key={id}
          id={id}
          swatches={swatches}
          onClick={handleSwatchClick}
        />
      ))}
    </div>
  );
}

function Swatch({ id, swatches, onClick }) {

  const swatch = swatches[id];

  const computeColor = () => {
    return swatches[swatch.parentId]?.color || swatch.color;
  };

  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        backgroundColor: computeColor(),
        cursor: "pointer",
      }}
      onClick={() => onClick(id)}
    ></div>
  );
}

//function AddSwatchButton({ onClick })
