import { derive, toHex } from "./utils.js";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function Swatch({ id, hswl, onClick }) {
  const color = toHex(hswl);
  const textColor = toHex(
    derive(hswl, { contrast: 5, adjustHue: 15, adjustSat: -0.2 }),
  );
  return (
    <Card
      variant="outlined"
      sx={{ width: 120, height: 60 }}
      style={{
        background: color,
      }}
      onClick={() => onClick(id)}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 22 }}
          style={{
            color: textColor,
          }}
          gutterBottom
        >
          {color}
        </Typography>
      </CardContent>
    </Card>
  );
}
