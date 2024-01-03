import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

export default function GradientSlider({ gradient, ...sliderProps }) {
  return (
    <Box sx={{ width: 300 }}>
      <Slider {...sliderProps} track={false} style={{ background: gradient }} />
    </Box>
  );
}
