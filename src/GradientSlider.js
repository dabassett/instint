import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function GradientSlider({ gradient, value, label, ...props }) {
  const textInputProps = {
    min: props?.min ?? 0,
    max: props?.max ?? 1,
    step: props.step,
    shrink: true,
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        {...props}
        value={value}
        track={false}
        valueLabelDisplay="auto"
        style={{ background: gradient }}
      />
{/*      <TextField
        id="outlined-number"
        label={label}
        type="number"
        value={value}
        size="small"
        onChange={props.onChange}
        InputLabelProps={textInputProps}
      />*/}
    </Box>
  );
}
