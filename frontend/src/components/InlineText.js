import { Stack, Typography } from "@mui/material";

export default function InlineText(props) {
  let { tag, value, alt } = props;
  alt = alt ?? "-";
  return (
    <Stack direction="row" sx={{ mt: 1 }}>
      <Typography paragraph sx={{ color: "text.disabled", p: 0, m: 0, mr: 1 }}>
        {tag}
      </Typography>
      <Typography>{value ? value : alt}</Typography>
    </Stack>
  );
}
