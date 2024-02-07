import { useContext } from "react";

import Typography from "@mui/material/Typography";

import { PaletteContext } from "../Contexts.js";

export default function WelcomeTab() {
  const palette = useContext(PaletteContext);

  return (
    <>
      <Typography variant="h3" style={{ color: palette.textA }} gutterBottom>
        Welcome!
      </Typography>
      <Typography
        variant="h4"
        style={{ color: palette.textAA }}
        gutterBottom
      >
        Instint is the one-click color designer.
      </Typography>
      <Typography variant="h6" style={{ color: palette.textAA }} gutterBottom>
        Every color on this page was derived automatically from the background
        color in this box.
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        Try it out! Click the refresh button above to roll a whole new look, or
        use the color controls at the bottom to fine-tune your own design.
      </Typography>
    </>
  );
}
