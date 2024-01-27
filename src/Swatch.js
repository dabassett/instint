import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import Typography from "@mui/material/Typography";
import Grow from "@mui/material/Grow";

import { derive, toHex } from "./utils.js";

const ReactiveCard = styled(Card)`
  ${({ theme }) => `
    cursor: pointer;
    transition: ${theme.transitions.create(["background-color", "transform"], {
      duration: theme.transitions.duration.shorter,
    })};
  `}
`;

const ReactiveActionArea = styled(CardActionArea)(({ theme }) => ({
  transition: theme.transitions.create(["transform"], {
    duration: theme.transitions.duration.shorter,
  }),

  // TODO remove !important tag
  //   specificity suggestions mentioned here:
  //    -> https://mui.com/material-ui/customization/how-to-customize/
  //   ...have not worked
  //
  //   Somewhere in the MUI pipeline the element is directly styled
  //    with `transition: none`, it could be a limitation of this
  //    component
  //   Also tried putting the transform under the sx prop without success
  //   The element is given class .MuiCardActionArea-root
  "&:hover": {
    transform: "scale(1.05) !important",
  },
}));

export default function Swatch({ id, hswl, active, onClick }) {
  const color = toHex(hswl);
  const textColor = toHex(
    derive(hswl, { contrast: 5, adjustHue: 15, adjustSat: -0.2 }),
  );

  return (
    <Grow in>
      <ReactiveActionArea>
        <ReactiveCard
          elevation={active ? 6 : 2}
          sx={{ width: "100%", height: 60 }}
          style={{
            background: color,
            borderTop: active
              ? `3px dotted ${textColor}`
              : "3px dotted transparent",
            borderBottom: active
              ? `3px dotted ${textColor}`
              : "3px dotted transparent",
          }}
          onClick={() => onClick(id)}
        >
          <CardContent>
            <Typography
              variant="h6"
              style={{
                color: textColor,
              }}
              gutterBottom
            >
              {color}
            </Typography>
          </CardContent>
        </ReactiveCard>
      </ReactiveActionArea>
    </Grow>
  );
}
