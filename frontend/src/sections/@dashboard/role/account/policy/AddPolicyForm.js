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
import { useState } from "react";
import { useParams } from "react-router";
import Editor from "src/components/editor";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
// ----------------------------------------------------------------------

AddPolicyDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBilling: PropTypes.func,
  onCloseCompose: PropTypes.func,
};

export default function AddPolicyDialog({
  onCloseCompose,
  open,
  data,
  onClose,
  onCreateBilling,
}) {
  const NewAddressSchema = Yup.object().shape({
    receiver: Yup.string().required("Fullname is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    zipCode: Yup.string().required("Zip code is required"),
  });

  const { warehouseId } = useParams();

  const [phoneNumber, setPhoneNumber] = useState("");

  let isEdit = typeof data == "object" ? true : false;

  const defaultValues = {
    addressType: "Home",
    receiver: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    isDefault: true,
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      onCreateBilling({
        receiver: data.receiver,
        phoneNumber: data.phoneNumber,
        fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
        addressType: data.addressType,
        isDefault: data.isDefault,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const [message, setMessage] = useState("");
  const handlePhoneChange = (newNumber) => {
    setPhoneNumber(newNumber);
    setValue("phoneNumber", newNumber);
  };
  const handleChangeMessage = (value) => {
    setMessage(value);
  };
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {/* <DialogTitle>{isEdit ? "Edit Policy" : "New Policy"}</DialogTitle> */}
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

          <IconButton onClick={onCloseCompose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <DialogContent>
          <Stack spacing={2}>
            <RHFTextField name="title" label="Policy Title" size="small" />

            <Card sx={{ p: 1 }}>
              <Stack sx={{ p: 1 }}>
                {/* <Typography variant="h6">Policy Description</Typography> */}
                <Divider />
              </Stack>
              <Editor
                full
                id="compose-mail"
                value={message}
                onChange={handleChangeMessage}
                placeholder="Policy Description....."
                sx={{ flexGrow: 1, borderColor: "transparent" }}
              />
            </Card>
            <Controller
              name="registeredDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Effective Date"
                  placeholder="Effective Date"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
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
