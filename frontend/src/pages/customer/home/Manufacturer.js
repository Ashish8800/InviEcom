import PropTypes from "prop-types";
import { Card, Avatar, Typography, Stack } from "@mui/material";

Manufacturer.propTypes = {
  data: PropTypes.object,
};

export default function Manufacturer({ data }) {
  return (
    <Card
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Avatar alt="" src="" sx={{ width: 48, height: 48 }} />
      <Stack sx={{ pl: 2 }}>
        <Typography>{data.name}</Typography>
      </Stack>
    </Card>
  );
}
