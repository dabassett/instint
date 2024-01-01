import { useState } from "react";
import Slider from '@mui/material/Slider';
import { alpha, styled } from '@mui/material/styles';

// TODO how to get a prop in here?
// const bg = "linear-gradient(.25turn, #f00, #00f)";

const GradientSlider = styled(Slider)(({ theme, gradient }) => ({
  width: 300,
  // color: theme.palette.success.main,
  background: gradient,
  '& .MuiSlider-thumb': {
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.success.main, 0.16)}`,
    },
    '&.Mui-active': {
      boxShadow: `0px 0px 0px 14px ${alpha(theme.palette.success.main, 0.16)}`,
    },
  },
}));

export default function StyledCustomization({ value, gradient }) {
  return <GradientSlider value={value} track={false} gradient={gradient} />;
}