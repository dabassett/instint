import { useContext } from "react";

import Typography from "@mui/material/Typography";

import { PaletteContext } from "../Contexts.js";

export default function HowToTab() {
  const palette = useContext(PaletteContext);

  return (
    <>
      <Typography variant="h3" style={{ color: palette.textA }} gutterBottom>
        How To Use Instint:
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        For best results turn off your blue light filter and any browser
        extensions that might interfere with Instint&apos;s colors.
      </Typography>
      <Typography
        variant="h5"
        style={{ color: palette.textAA }}
        gutterBottom
        sx={{ mt: 3 }}
      >
        Resetting
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        Clicking the refresh button at the top of the page will erase any
        changes and build a new palette. Use it when you need to start fresh.
      </Typography>
      <Typography
        variant="h5"
        style={{ color: palette.textAA }}
        gutterBottom
        sx={{ mt: 3 }}
      >
        Editing Swatches
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        Click a swatch from the list to select it and use the sliders at the
        bottom to edit its hue, saturation, and luminance attributes.
      </Typography>
      <Typography
        variant="h5"
        style={{ color: palette.textAA }}
        gutterBottom
        sx={{ mt: 3 }}
      >
        Swatch Inheritance
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        Most swatches are inheriting their attributes from the first one in the
        palette. Editing a parent swatch will automatically update all of its
        children.
      </Typography>
      <Typography
        variant="h5"
        style={{ color: palette.textAA }}
        gutterBottom
        sx={{ mt: 3 }}
      >
        Inheritance Modes
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        Child swatches have additional settings that appear next to their
        attributes. These control how parent and child swatches&apos; attributes
        are combined.
      </Typography>
      <Typography
        variant="h6"
        style={{ color: palette.textAA }}
        gutterBottom
        sx={{ mt: 1 }}
      >
        Adjust (ADJ)
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        The child&apos;s value is added to the parent&apos;s.
      </Typography>
      <Typography
        variant="h6"
        style={{ color: palette.textAA }}
        gutterBottom
        sx={{ mt: 1 }}
      >
        Fixed (FIX)
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        Only the child&apos;s value will be used. Use fixed when you want a
        child swatch to ignore changes to the parent for one or more attributes.
      </Typography>
      <Typography
        variant="h6"
        style={{ color: palette.textAA }}
        gutterBottom
        sx={{ mt: 1 }}
      >
        Contrast
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        This setting controls the relative contrast ratio between the parent and
        child colors. Higher values are more suitable for smaller text. (Only
        applies to luminance)
      </Typography>
    </>
  );
}
