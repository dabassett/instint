# Instint - The one-click color designer

Instint is a free, open-source tool for rapidly prototyping your site's color
theme. Starting with a single background color it **automatically generates the
rest of the palette**.

Instint also **continuously applies your palette to itself** so you can
experiment freely and see the results immediately.

#### [Try Instint now](https://dabassett.github.io/instint/)

Designers and developers alike struggle with color because, for
such a complex, nuanced topic, the majority of resources and tools
available are simply inadequate. As a result much of the internet is,
frankly, visually boring. My goal with Instint is to make color design
fun again.

## How Does It Work?

Instint is driven by two key innovations. To directly compute new colors
from existing ones I created HSWL, a perceptual color space based on the
WCAG relative luminance formula. I also built a reactive palette, to
continuously update the site's color theme as you make changes.

### HSWL

HSWL stands for Hue, Saturation, WCAG Luminance. By replacing the
lightness dimension of HSL with *relative luminance*, it becomes possible
to simply calculate a new color with a specific contrast to an existing
one.

#### What Is Relative Luminance?

Relative luminance is defined in the [Web Content and Accessibility Guidelines](https://en.wikipedia.org/wiki/Web_Content_Accessibility_Guidelines),
a collection of standards used to help ensure that the web is functional and
accessible for everyone. Among them are the formulas for relative luminance and
contrast ratio, used to evaluate if a particular text color is readable on a
particular background color.

- [1.4.3 Contrast - Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [1.4.6 Contrast - Enhanced](https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced)

The relative luminance formula is a reasonably close approximation for how the
human eye perceives a color's brightness. Unfortunately using it is cumbersome
in practice because (before HSWL) there was no way to directly transform a
color's relative luminance in the typical RGB, HSL, or HSV color spaces.

### Reactive Palette

Instint's palette is unique because it defines relationships
between colors. Each swatch may have one parent and any number of
children, forming an inheritance tree.

Child swatches inherit their parent's hue, saturation, and
luminance and then apply their own adjustments to those attributes to
compute their final color.

When a swatch is changed, Instint propagates those changes down through
the tree and then rerenders the page with updated colors.
