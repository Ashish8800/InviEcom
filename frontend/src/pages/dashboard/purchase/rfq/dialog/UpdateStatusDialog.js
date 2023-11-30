import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
// assets
import { useEffect, useState } from "react";
import apiUrls from "src/routes/apiUrls";
import { Api } from "src/utils";
import FormProvider, { RHFSelect } from "../../../../../components/hook-form";

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  "generated",
  "send_to_vendor",
  "quote_receive",
  "cancel",
];
// ==================

UpdateStatusDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
};

export default function UpdateStatusDialog({ open, onClose, data }) {
  const FormValidationSchema = Yup.object().shape({
    status: Yup.string().required("status is required"),
  });

  const [loadingSend, setLoadingSend] = useState(false);

  const defaultValues = {
    status: "",
    id: "",
  };

  const methods = useForm({
    resolver: yupResolver(FormValidationSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = async (data) => {
    setLoadingSend(true);
    Api.put(apiUrls.purchase.rfq.status(data.id), data)
      .then((res) => {
        if (res.result) {
          setLoadingSend(true);
          reset();
          onClose();
          window.Toast(res.message);
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("status", data.status);
      setValue("id", data.id);
    }
  }, [data, setValue]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Update Status</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <Stack direction="row">
              <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                RFQ Number:
              </Typography>
              <Typography> {data?.id}</Typography>
            </Stack>
            <Stack>
              {data?.pdfUrl && (
                <iframe
                  title={data?.pdfUrl}
                  height={400}
                  src={data?.pdfUrl}
                ></iframe>
              )}
            </Stack>
            <RHFSelect
              size="small"
              fullWidth
              name="status"
              label="Status"
              sx={{ mt: 1 }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loadingSend && isSubmitting}
          >
            Submit
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
