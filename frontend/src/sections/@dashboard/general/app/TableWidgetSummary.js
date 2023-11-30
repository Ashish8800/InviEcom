import PropTypes from "prop-types";
// @mui
import { alpha, useTheme } from "@mui/material/styles";
import { Card, Stack, Typography } from "@mui/material";
// utils
import { bgGradient } from "../../../../utils/cssStyles";
import { fShortenNumber } from "../../../../utils/formatNumber";
// components
import Iconify from "../../../../components/iconify";

// ----------------------------------------------------------------------

TableWidgetSummary.propTypes = {
  sx: PropTypes.object,
  color: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.array,
};

export default function TableWidgetSummary({
  title,
  icon,
  color = "primary",
  sx,
  data,
  ...other
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        boxShadow: 0,
        color: theme.palette[color].darker,
        bgcolor: theme.palette[color].light,
        ...sx,
      }}
      {...other}
    >
      <Stack sx={{ p: 3 }} spacing={2}>
        <Typography variant="h6">{title}</Typography>

        {data?.map((item,index) => {
          return (
            <Stack
              key={`${item.key}_${index}`}
              direction="row"
              justifyContent="space-between"
            >
              <Typography>{item.key}</Typography>
              <Typography>{item.value}</Typography>
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
}
