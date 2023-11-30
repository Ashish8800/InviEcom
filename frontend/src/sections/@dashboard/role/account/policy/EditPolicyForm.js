import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { useForm ,Controller} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  Card,
  DialogTitle,
  TextField,
  Typography,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LoadingButton } from "@mui/lab";
// assets
import { countries } from "src/assets/data";
import FormProvider, {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
} from "src/components/hook-form";
import { useParams } from "react-router";
import { useState } from "react";
import { MuiTelInput } from "mui-tel-input";
import Editor from "src/components/editor";
// ----------------------------------------------------------------------

EditPolicyForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

export default function EditPolicyForm({
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

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>New Policy</DialogTitle>

        <DialogContent >
          <Stack spacing={2} >
            <RHFTextField name="title" label="Policy Title" size="small" />

            <Card sx={{ p: 1}} >
              <Stack sx={{ p: 1 }}>
                {/* <Typography variant="h6">Policy Description</Typography> */}
                <Divider />
              </Stack>
              <Editor
                simple
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
