import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function GradientSlider({
  gradient,
  color,
  value,
  label,
  ...props
}) {
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
        sx={{
          borderRadius: "2px",
          height: 40,

          "& .MuiSlider-rail": {
            visibility: "hidden",
          },
          "& .MuiSlider-thumb": {
            height: 70,
            width: 20,
            border: "1px solid black",
            outline: "1px solid white",
            borderRadius: "inherit",
            "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
              boxShadow: "inherit",
            },
            "&::before": {
              display: "none",
            },
          },
          "& .MuiSlider-valueLabel": {
            lineHeight: 1.2,
            fontSize: 12,
            background: "unset",
            padding: 0,
            width: 32,
            height: 32,
            borderRadius: "50% 50% 50% 0",
            backgroundColor: "#051905",
            transformOrigin: "bottom left",
            transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
            "&::before": { display: "none" },
            "&.MuiSlider-valueLabelOpen": {
              transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
            },
            "& > *": {
              transform: "rotate(45deg)",
            },
          },
        }}
        // style is used for dynamic values to place the styles inline
        //  otherwise MUI will put new stylesheets in <head> on each update,
        //  resulting in a memory leak
        style={{
          background: gradient,
        }}
        slotProps={{
          thumb: {
            style: {
              color: color,
            },
          },
        }}
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
