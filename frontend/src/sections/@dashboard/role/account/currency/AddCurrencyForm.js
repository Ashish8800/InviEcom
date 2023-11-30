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
  Stack,
} from "@mui/material";
// assets
import { useState } from "react";
import { useParams } from "react-router";
import FormProvider, { RHFTextField } from "src/components/hook-form";
// ----------------------------------------------------------------------

AddCurrencyDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

export default function AddCurrencyDialog({
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

  const handlePhoneChange = (newNumber) => {
    setPhoneNumber(newNumber);
    setValue("phoneNumber", newNumber);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>New currency</DialogTitle>

        <DialogContent>
          <Stack spacing={1}>
            <RHFTextField name="name" label="Currency Name" size="small" />

            <RHFTextField name="symbol" label="Currency Symbol" size="small" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Save
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
