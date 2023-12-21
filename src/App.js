import { useState } from 'react'



const randomColor = () => {
  let hex_color = Math
    .floor(Math.random()*16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${hex_color}`;
}

let initialSwatches = [
  {id: 0, color: randomColor(), parent: null},
]

let nextId = initialSwatches.length;

export default function App() {
  const [lastColor, setLastColor] = useState("#000000");
  const [swatches, setSwatches] = useState(initialSwatches);


  const handleSwatchClick = (id) => {
    let newColor = randomColor()
    setLastColor(newColor)

    // TODO: swatches should be an object
    //       also causing parent/child updating to happen out of order
    const nextSwatches = swatches.map(swatch => {
      if (swatch.id === id) {
        return {
          ...swatch,
          color: newColor
        };
      } else if (swatch.parent?.id === id) {
        return {
          ...swatch,
          parent: swatches[id]
        };
      }
      return swatch;
    });
    setSwatches(() => nextSwatches);
  }


  // todo separate text tags from swatch components
  return (
    <div className="App">
      <h1>Instint</h1>
      <h2
      style={{
        color: lastColor,
      }}>Generate an entire color palette from a single input!</h2>

      <button onClick={() => {
        setSwatches([
          ...swatches,
          { id: nextId++, color: randomColor(), parent: swatches[0] }
        ]);
      }}>Add Swatch</button>

      {swatches.map(swatch => (
        <Swatch key={swatch.id} id={swatch.id} color={swatch.color} parent={swatch.parent} onClick={handleSwatchClick} />
      ))}
    </div>
  );
}


function Swatch({ id, color, parent, onClick }) {
  return (
    <div
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: parent?.color || color,
        cursor: 'pointer',
      }}
      onClick={() => onClick(id)}
    >
    </div>
  );
}


//function AddSwatchButton({ onClick })