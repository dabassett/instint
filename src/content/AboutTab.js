import { useContext } from "react";

import Typography from "@mui/material/Typography";

import { PaletteContext } from "../Contexts.js";

export default function AboutTab() {
  const palette = useContext(PaletteContext);

  return (
    <>
      <Typography variant="h3" style={{ color: palette.textA }} gutterBottom>
        About:
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        TODO
      </Typography>
    </>
  );
}
