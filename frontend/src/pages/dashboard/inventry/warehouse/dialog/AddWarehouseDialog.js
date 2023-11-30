import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
// assets
import { MuiTelInput } from "mui-tel-input";
import { useEffect, useState } from "react";
import Warehouse from "src/controller/inventory/Warehouse.controller";
import { countries } from "../../../../../assets/data";
import FormProvider, {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
} from "../../../../../components/hook-form";
// ----------------------------------------------------------------------

AddWarehouseDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function AddWarehouseDialog({ open, data, onClose }) {
  const WarehouseFormSchema = Yup.object().shape({
    name: Yup.string().required("Warehouse name is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    // address: Yup.string().required("Address is required"),
    // city: Yup.string().required("City is required"),
    // state: Yup.string().required("State is required"),
    // country: Yup.string().required("Country is required"),
    pincode: Yup.string().required("Pin code is required"),
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [requestError, setRequestError] = useState("");

  let isEdit = typeof data == "object" ? true : false;

  const methods = useForm({
    resolver: yupResolver(WarehouseFormSchema),
    defaultValues: {
      id: null,
      name: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      isDefault: false,
    },
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    formState,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    // Following data has passed in the Warehouse create request
    // "name": "Warehouse c",
    // "contact": "8931916663",
    // "address": "hajratganj",
    // "city": "Lucknow",
    // "state":"uttar pradesh",
    // "country":"india",
    // "pincode":"206001",
    // "status":"active"

    data.status = data.isDefault ? "active" : "inactive";
    data.contact = data.phoneNumber;

    delete data.phoneNumber;
    delete data.isDefault;
    delete data.addressType;

    if (!data.id) {
      Warehouse.create(data)
        .then((result) => {
          reset();
          window.Toast("Warehouse created successfully");
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message);
        });
    } else {
      console.log("update warehouse called");
      Warehouse.update(data.id,data)
        .then((result) => {
          window.Toast("Warehouse updated successfully");
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message);
        });
    }
  };

  useEffect(() => {
    setPhoneNumberError(formState.errors.phoneNumber?.message ?? "");
  }, [formState.errors]);

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("phoneNumber", data.contact);
      setValue("address", data.address);
      setValue("city", data.city);
      setValue("state", data.state);
      setValue("country", data.country);
      setValue("pincode", data.pincode);
      setValue("isDefault", data.status == "active" ? true : false);
      setPhoneNumber(data.contact);
    } else {
      reset({
        id: null,
        name: "",
        phoneNumber: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        isDefault: false,
      });
      setPhoneNumber("");
    }
  }, [data]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEdit ? "Edit Warehouse" : "Add Warehouse"}</DialogTitle>

        <DialogContent>
          <Stack spacing={3} paddingTop={1}>
            {Boolean(requestError) && (
              <Alert severity="error">{requestError}</Alert>
            )}
            <RHFTextField name="name" label="Warehouse Name*" />
            <MuiTelInput
              defaultCountry="IN"
              name="phoneNumber"
              value={phoneNumber}
              label="Contact Number"
              onChange={(value) => {
                setPhoneNumber(value);
                setPhoneNumberError("");
                setValue("phoneNumber", value);
              }}
              error={Boolean(phoneNumberError)}
              helperText={phoneNumberError}
            />

            <RHFTextField name="address" label="Address*" />
            <RHFTextField name="city" label="City*" />
            <RHFTextField name="state" label="State*" />
            <RHFSelect native name="country" label="Country">
              <option value="" />
              {countries.map((country) => (
                <option key={country.code} value={country.label}>
                  {country.label}
                </option>
              ))}
            </RHFSelect>
            <RHFTextField name="pincode" label="PIN Code*" />
            <RHFCheckbox name="isDefault" label="Active" />
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
