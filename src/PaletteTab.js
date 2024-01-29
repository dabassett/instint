import Tab from "@mui/material/Tab";

// this custom Tab component will inject inline color syles that respond to
//  the Tab's own state as well as updating with changes to the palette
export default function PaletteTab({ dynamicStyles, ...props }) {
  const styles = {
    style: {
      ...(props.selected ? dynamicStyles.selected : dynamicStyles.unselected),
    },
  };

  return <Tab {...props} {...styles} />;
}
