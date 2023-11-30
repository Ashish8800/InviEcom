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
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

// assets
import Editor from "src/components/editor/Editor";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import { REMOVE_SCROLLBAR_SX } from "src/config-global";
import RFQ from "src/controller/purchase/RFQ.controller";

// ==================

RFQMailDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function RFQMailDialog({ open, onClose, data }) {
  const [description, setDescription] = useState("");
  const [loadingButtonState, setLoadingButtonState] = useState(false);

  const FormSchema = Yup.object().shape({
    sendTo: Yup.string().required("Send to is required"),
    replyTo: Yup.string().required("Reply to is required"),
    subject: Yup.string().required("Subject is required"),
    mail: Yup.string().required("Mail content is required"),
  });

  const defaultValues = {
    sendTo: "",
    replyTo: "",
    mail: "",
    id: "",
    subject: "",
  };

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const { setValue, handleSubmit, reset, formState } = methods;

  const onSubmit = (data) => {
    setLoadingButtonState(true);
    RFQ.sendMail(data)
      .then((res) => {
        setLoadingButtonState(false);
        window.Toast("Email send to vendor successfully");
        reset({ subject: "", mail: "" });
        setDescription("");
        onClose();
      })
      .catch((err) => {
        setLoadingButtonState(false);
      });
  };

  useEffect(() => {
    if (data) {
      setValue("sendTo", data.sendTo);
      setValue("replyTo", data.replyTo);
      setValue("id", data.id);
      setValue("pdfFile", data.pdf);
    }
  }, [data, setValue]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      sx={{
        ...REMOVE_SCROLLBAR_SX,
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ paddingBottom: 0 }}>RFQ Generated</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography>
              You can download the RFQ in PDF or send the same over the Email.
            </Typography>
            {data?.pdfUrl && (
              <iframe
                title={data?.pdfUrl}
                height={400}
                src={data?.pdfUrl}
              ></iframe>
            )}

            <RHFTextField size="small" name="sendTo" label="Send To" />

            <RHFTextField size="small" name="replyTo" label="Reply To" />

            <RHFTextField size="small" name="subject" label="Subject" />

            <Stack sx={{ p: 1 }}>
              <Divider />
            </Stack>
            <Editor
              name="mail"
              full
              id="compose-mail"
              value={description}
              onChange={(value) =>
                setDescription(value) || setValue("mail", value)
              }
              placeholder="Mail Content"
              sx={{ flexGrow: 1, borderColor: "transparent" }}
            />
            <Typography color="error">
              {formState.errors.mail?.message ?? ""}
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loadingButtonState}
          >
            Send Email
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
