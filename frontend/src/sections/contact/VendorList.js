import PropTypes from "prop-types";
import { Card, Avatar, Typography, Stack } from "@mui/material";

VendorList.propTypes = {
  data: PropTypes.array,
};

export default function VendorList({ data }) {
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
        <Typography>{data.vendorDisplayName}</Typography>
      </Stack>
    </Card>
  );
}
