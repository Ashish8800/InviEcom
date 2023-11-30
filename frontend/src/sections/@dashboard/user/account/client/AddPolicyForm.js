import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
// assets
import { useEffect, useState } from "react";
import Editor from "src/components/editor";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import Policy from "src/controller/settings/Policy.controller";
// ----------------------------------------------------------------------

AddPolicyDialog.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBilling: PropTypes.func,
  onCloseCompose: PropTypes.func,
  row: PropTypes.object,
};

export default function AddPolicyDialog({ open, data, onClose, isView }) {
  const NewPolicySchema = Yup.object().shape({
    name: Yup.string().required("Title is required"),
    effectiveDate: Yup.string().required("Effective Date is required"),
  });

  const { enqueueSnackbar } = useSnackbar();

  let isEdit = typeof data == "object" ? true : false;

  const [requestError, setRequestError] = useState("");

  const defaultValues = {
    name: "",
    effectiveDate: "",
    description: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewPolicySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    if (description.length <= 0 || description === "") {
      window.Toast("Please write a policy discription", { variant: "error" });
      return false;
    } else {
      data.description = description;
    }

    if (isEdit) {
      Policy.update(data)
        .then((res) => {
          enqueueSnackbar("Policy updated successfully");
          reset({ ...defaultValues, ...res });
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message);
          enqueueSnackbar("Duplicate policy name", { variant: "error" });
        });
    } else {
      Policy.create(data)
        .then(() => {
          enqueueSnackbar("Policy created successfully");
          reset(defaultValues);
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message);
          enqueueSnackbar("Duplicate policy name", { variant: "error" });
        });
    }
  };

  const [description, setDescription] = useState("");

  const handleChangeDescription = (value) => {
    setDescription(value);
  };

  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("description", data.description);
      setValue("effectiveDate", data.effectiveDate);
      setDescription(data.description);
    } else {
      setValue("id", "");
      setValue("name", "");
      setValue("description", "");
      setValue("effectiveDate", null);
      setDescription("");
    }
  }, [data]);

  useEffect(() => {
    if (!isEdit) {
      setValue("description", "");
      setDescription("");
    }
  }, []);

  useEffect(() => {
    if (isView) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("description", data.description);
      setValue("effectiveDate", data.effectiveDate);
      setDescription(data.description);
    }
  });

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="md"
      open={open}
      onClose={onClose}
      sx={{ backgroundColor: "white" }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            py: 2,
            pl: 2.5,
            pr: 1,
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {isEdit ? "Edit Policy" : "New Policy"}
          </Typography>

          <IconButton onClick={() => setFullScreen(!fullScreen)}>
            <Iconify
              icon={fullScreen ? "eva:collapse-fill" : "eva:expand-fill"}
            />
          </IconButton>
        </Stack>

        <DialogContent>
          <Stack spacing={2} sx={{ p: 1 }}>
            <RHFTextField name="name" label="Policy Title" size="small" />

            <Card sx={{ p: 1 }}>
              <Stack sx={{ p: 1 }}>
                <Divider />
              </Stack>
              <Editor
                name="description"
                full
                id="compose-mail"
                value={description}
                onChange={handleChangeDescription}
                placeholder="Policy Description....."
                sx={{ flexGrow: 1, borderColor: "transparent" }}
              />
            </Card>
            <Controller
              name="effectiveDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Effective Date"
                  placeholder="Effective Date"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                    setValue("effectiveDate", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {isEdit ? "Update" : "Add"}
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
