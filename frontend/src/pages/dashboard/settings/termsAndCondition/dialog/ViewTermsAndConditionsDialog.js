import PropTypes from "prop-types";
// form
// @mui
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { convertHtmlToText } from "src/utils";

ViewTermsAndConditionsDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
};

export default function ViewTermsAndConditionsDialog({ open, data, onClose }) {
  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose}>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography variant="h6">Terms & Conditions</Typography>

          <Divider/>
          <Stack direction="row">
            <Typography variant="h6" paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Title:
            </Typography>
            <Typography >{data?.name}</Typography>
          </Stack>
          <Stack direction="row">
            <Typography variant="h6" paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Description:
            </Typography>
            <Typography >{convertHtmlToText(data?.description)}</Typography>
          </Stack>
          <Stack direction="row">
            <Typography variant="h6" paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Scope:
            </Typography>
            {data?.scope?.length > 0 &&
              data?.scope?.map((item) => {
                return <Chip  sx={{ml:1 }} label={item} />;
              })}
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="error" variant="contained" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
