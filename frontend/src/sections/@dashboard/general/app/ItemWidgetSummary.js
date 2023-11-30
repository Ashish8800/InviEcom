import PropTypes from "prop-types";
// @mui
import { alpha, useTheme } from "@mui/material/styles";
import { Card, Typography, Stack } from "@mui/material";
// utils
import { bgGradient } from "../../../../utils/cssStyles";
import { fShortenNumber } from "../../../../utils/formatNumber";
// components
import Iconify from "../../../../components/iconify";

// ----------------------------------------------------------------------

ItemWidgetSummary.propTypes = {
  sx: PropTypes.object,
  icon: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default function ItemWidgetSummary({
  title,
  total,
  icon,
  color = "primary",
  sx,
  ...other
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: 1,
        boxShadow: 0,
        color: theme.palette[color].darker,
        bgcolor: theme.palette[color].light,
        ...sx,
      }}
      {...other}
    >
      <Iconify
        icon={icon}
        sx={{
          p: 1.5,
          top: 24,
          right: 24,
          width: 48,
          height: 48,
          borderRadius: "50%",
          position: "absolute",
          color: theme.palette[color].lighter,
          bgcolor: theme.palette[color].dark,
        }}
      />

      <Stack sx={{ p: 3}}>
        <Stack sx={{ pb: 2 }}>
          <Typography variant="h6">Item Status</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography paragraph  >
            Low Stock Items
          </Typography>
          <Typography >10</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography paragraph  >
            Ordered Items
          </Typography>
          <Typography >5</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography paragraph  >
            Receiving Due Items
          </Typography>
          <Typography >3</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
