import { styled } from '@mui/material/styles';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { derive, toHex } from "./utils.js";

const ReactiveCard = styled(Card)`
  ${({ theme }) => `
  cursor: pointer;
  transition: ${theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.shorter,
  })};
  &:hover {
    transform: scale(1.05);
  }
  `}
`;

export default function Swatch({ id, hswl, onClick }) {
  const color = toHex(hswl);
  const textColor = toHex(
    derive(hswl, { contrast: 5, adjustHue: 15, adjustSat: -0.2 }),
  );

  return (
    <ReactiveCard
      variant="outlined"
      sx={{ width: 120, height: 60 }}
      style={{
        background: color,
      }}
      onClick={() => onClick(id)}
    >
      <CardContent>
        <Typography
          variant="h6"
          //sx={{ fontSize: 22 }}
          style={{
            color: textColor,
          }}
          gutterBottom
        >
          {color}
        </Typography>
      </CardContent>
    </ReactiveCard>
  );
}
