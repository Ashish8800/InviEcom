import * as Yup from "yup";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Stack,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import FormProvider, { RHFTextField } from "../../../components/hook-form";
import SourceController from "src/controller/purchase/Source.controller.js";

// ----------------------------------------------------------------------

AddSourceForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function AddSourceForm({ open, onClose }) {
  const [requestError, setRequestError] = useState("");

  const SourceSchema = Yup.object().shape({
    name: Yup.string().required("Source name is required"),
  });

  const defaultValues = {
    name: "",
  };

  const methods = useForm({
    resolver: yupResolver(SourceSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);
    SourceController.create(data)
      .then(() => {
        reset(defaultValues);
        onClose();
      })
      .catch((error) => {
        setRequestError(error.message);
      });
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add Requested Source</DialogTitle>

        <DialogContent dividers>
          {Boolean(requestError) && (
            <Alert severity="error">{requestError}</Alert>
          )}

          <Stack spacing={1} paddingTop={1}>
            <RHFTextField size="small" name="name" label="Requested Source" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
           
          >
            Add
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
