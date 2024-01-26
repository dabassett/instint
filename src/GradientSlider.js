import Slider from "@mui/material/Slider";
import Paper from "@mui/material/Paper";

export default function GradientSlider({
  gradient,
  color,
  value,
  label,
  ...props
}) {
  return (
    // TODO paper's height needed to be set otherwise it extended beyond the slider
    <Paper elevation={4} sx={{ height: { xs: 31, sm: 66 } }}>
      <Slider
        {...props}
        value={value}
        track={false}
        valueLabelDisplay="auto"
        sx={{
          borderRadius: "2px",
          height: { xs: 5, sm: 40 },

          "& .MuiSlider-rail": {
            visibility: "hidden",
          },
          "& .MuiSlider-thumb": {
            height: { xs: 35, sm: 70 },
            width: 20,
            border: "1px solid black",
            outline: "1px solid #ccc",
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
