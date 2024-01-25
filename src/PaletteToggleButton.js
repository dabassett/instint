import ToggleButton from "@mui/material/ToggleButton";

// this toggle button includes a dynamicColors prop to allow for live color
//  updates while otherwise behaving like the default component
export default function PaletteToggleButton({ dynamicColors, ...props }) {
  const colorStyles = {
    style: {
      color: props.selected
        ? dynamicColors.color
        : dynamicColors.colorUnselected,
      background: props.selected
        ? dynamicColors.backgroundSelected
        : dynamicColors.backgroundUnselected,
    },
  };

  return <ToggleButton {...props} {...colorStyles} />;
}
