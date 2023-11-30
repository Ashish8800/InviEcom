import { Divider } from "@mui/material";

export default function DashedDivider(props) {
  const { sx } = props;
  return <Divider sx={{ borderStyle: "dashed", marginY: 2, ...sx }} />;
}
