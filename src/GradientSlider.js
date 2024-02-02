import Slider from "@mui/material/Slider";
import Paper from "@mui/material/Paper";

// calculate related element heights
const height = {
  slider: { xs: 30, sm: 65 },
};
height.paper = height.slider;
height.thumb = {
  xs: height.slider.xs + 15,
  sm: height.slider.sm + 15,
};

export default function GradientSlider({
  gradient,
  color,
  value,
  label,
  ...props
}) {
  return (
    // TODO paper's height needed to be set otherwise it extended beyond the slider
    // TODO replace with vanilla box shadow
    //       after working with it further, it's clear this isn't the correct usage
    //       of paper and it was a coincidence that it mostly worked
    <Paper elevation={4} sx={{ height: height.paper }}>
      <Slider
        {...props}
        value={value}
        track={false}
        valueLabelDisplay="auto"
        sx={{
          // override some default styles that resize the slider's padding
          //  for mobile devices
          paddingY: 0,
          "@media (pointer: coarse)": {
            paddingY: 0,
          },
          borderRadius: "2px",
          height: height.slider,

          "& .MuiSlider-rail": {
            visibility: "hidden",
          },
          "& .MuiSlider-thumb": {
            height: height.thumb,
            width: 20,
            border: "1px solid black",
            outline: "1px solid #ccc",
            borderRadius: "100px",
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
        // the style prop is used to force inline css for the dynamic background
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
    </Paper>
  );
}
