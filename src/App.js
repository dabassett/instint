import { useState } from 'react'



const randomColor = () => {
  let hex_color = Math
    .floor(Math.random()*16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${hex_color}`;
};

let initialSwatches = {
  0: {color: randomColor(), parentId: null},
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
    }

    setSwatches(() => nextSwatches);
  };


  // todo separate text tags from swatch components
  return (
    <div className="App">
      <h1>Instint</h1>
      <h2
      style={{
        color: lastColor,
      }}>Generate an entire color palette from a single input!</h2>

      <button onClick={() => {
        setSwatches({
          ...swatches,
          // todo: hardcoded parentId
          [nextId++]: { color: "#00ff00", parentId: 0 }
        });
      }}>Add Swatch</button>

      {Object.keys(swatches).map(id => (
        <Swatch key={id} id={id} swatches={swatches} onClick={handleSwatchClick} />
      ))}
    </div>
  );
}


function Swatch({ id, swatches, onClick }) {
  const swatch = swatches[id]
  return (
    <div
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: swatches[swatch.parentId]?.color || swatch.color,
        cursor: 'pointer',
      }}
      onClick={() => onClick(id)}
    >
    </div>
  );
}


//function AddSwatchButton({ onClick })