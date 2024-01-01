import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
// import { alpha, styled } from '@mui/material/styles';
// import { css } from '@emotion/react';

export default function GradientSlider({ value, gradient, onChange }) {
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        value={value}
        track={false}
        onChange={onChange}
        style={{ background: gradient }}
      />
    </Box>
  );
}
