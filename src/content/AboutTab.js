import { useContext } from "react";

import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";

import { PaletteContext } from "../Contexts.js";

export default function AboutTab() {
  const palette = useContext(PaletteContext);

  return (
    <>
      <Typography variant="h3" style={{ color: palette.textA }} gutterBottom>
        About
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        Instint is a color design tool that solves two interrelated problems:
      </Typography>
      <List sx={{ listStyleType: "disc" }}>
        <ListItemText
          sx={{ ml: 4, display: "list-item" }}
          style={{ color: palette.textAAA }}
        >
          Rapidly prototyping an entire site&apos;s color theme
        </ListItemText>
        <ListItemText
          sx={{ ml: 4, display: "list-item" }}
          style={{ color: palette.textAAA }}
        >
          Ensuring that text is as readable according to the WCAG 2 standards for
          color contrast
        </ListItemText>
      </List>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        Designers and developers alike struggle with color design because, for
        such a complex, nuanced topic, the majority of resources and tools
        available are basic and inadequate. My goal with Instint is to help fill
        that gap.
      </Typography>
      <Typography
        variant="h5"
        style={{ color: palette.textAA }}
        gutterBottom
        sx={{ mt: 3 }}
      >
        How Does It Work?
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        Instint is driven by two key innovations. To directly compute new colors
        from existing ones I created HSWL, a perceptual color space based on the
        WCAG relative luminance formula. I also built a reactive palette, to
        continuously update the site&apos;s color theme as you make changes.
      </Typography>
      <Typography
        variant="h6"
        style={{ color: palette.textAA }}
        gutterBottom
        sx={{ mt: 3 }}
      >
        HSWL
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        HSWL stands for Hue, Saturation, WCAG Luminance. By replacing the
        lightness dimension of HSL with relative luminance, it becomes possible
        to simply calculate a new color with a specific contrast to an existing
        one.
      </Typography>
      <Typography
        variant="h6"
        style={{ color: palette.textAA }}
        gutterBottom
        sx={{ mt: 3 }}
      >
        What Is Relative Luminance?
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        The{" "}
        <Link
          href="https://en.wikipedia.org/wiki/Web_Content_Accessibility_Guidelines"
          style={{ color: palette.linkAAA }}
          target="_blank"
        >
          Web Content and Accessibility Guidelines (WCAG)
        </Link>{" "}
        are a collection of standards used to help ensure that the web is
        functional and accessible for everyone. Among them are guidelines for
        evaluating if a particular text color is readable on a particular
        background color. Here you will find formulas for relative luminance and
        contrast ratio.
      </Typography>
      <List sx={{ listStyleType: "disc" }}>
        <ListItemText
          sx={{ ml: 4, display: "list-item" }}
          style={{ color: palette.textAAA }}
        >
          <Link
            href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
            style={{ color: palette.linkAAA }}
            target="_blank"
          >
            1.4.3 Contrast (Minimum)
          </Link>
        </ListItemText>
        <ListItemText
          sx={{ ml: 4, display: "list-item" }}
          style={{ color: palette.textAAA }}
        >
          <Link
            href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced"
            style={{ color: palette.linkAAA }}
            target="_blank"
          >
            1.4.6 Contrast (Enhanced)
          </Link>
        </ListItemText>
      </List>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        The relative luminance formula is a reasonably close approximation for
        how the human eye perceives a color&apos;s brightness. Unfortunately
        using it is cumbersome in practice because (before HSWL) there was no
        way to directly transform a color&apos;s relative luminance in the
        typical RGB, HSL, or HSV color spaces.
      </Typography>

      <Typography
        variant="h6"
        style={{ color: palette.textAA }}
        gutterBottom
        sx={{ mt: 3 }}
      >
        Reactive Palette
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        Instint&apos;s palette is unique because it defines relationships
        between colors. Each swatch may have one parent and any number of
        children, forming an inheritance tree.
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        Child swatches inherit their parent&apos;s hue, saturation, and
        luminance and then apply their own adjustments to those attributes to
        compute their final color.
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        When a swatch is changed, Instint propogates those changes down through
        the tree and then rerenders the page with updated colors.
      </Typography>
      {/*      <Typography
        variant="h5"
        style={{ color: palette.textAA }}
        gutterBottom
        sx={{ mt: 3 }}
      >
        The Future
      </Typography>
      <Typography
        variant="body1"
        style={{ color: palette.textAAA }}
        gutterBottom
      >
        I first designed HSWL in 2015, and since then there have been many
        developments in web color design. Notably OKLab, which has greatly
        improved on older color models, ...
      </Typography>*/}
    </>
  );
}
