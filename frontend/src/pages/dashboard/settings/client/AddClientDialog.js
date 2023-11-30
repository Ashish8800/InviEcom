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
import { useEffect, useState } from "react";
import { useSnackbar } from "src/components/snackbar";
import Client from "src/controller/purchase/Client.controller";
import { countries } from "../../../../assets/data";
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from "../../../../components/hook-form";

// ----------------------------------------------------------------------

AddClientDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function AddClientDialog({ open, onClose, data }) {
  const ClientValidationSchema = Yup.object().shape({
    name: Yup.string().required("Fullname is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    pincode: Yup.string().required("Pin code is required"),
  });

  const [requestError, setRequestError] = useState("");

  let isEdit = typeof data == "object" ? true : false;

  const defaultValues = {
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    status: false,
  };

  const methods = useForm({
    resolver: yupResolver(ClientValidationSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState,
    formState: { isSubmitting },
    reset,
  } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    data.status = data.status ? "active" : "inactive";

    if (isEdit) {
      Client.update(data.id,data)
        .then((res) => {
          enqueueSnackbar("Client updated successfully");
          reset({ ...defaultValues, ...res });
          onClose();
        })
        .catch((error) => {
          window.ToastError(error.message, { variant: "error" });
        });
    } else {
      Client.create(data)
        .then(() => {
          enqueueSnackbar("Client created successfully");
          reset(defaultValues);
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message, { variant: "error" });
          enqueueSnackbar(error.message, { variant: "error" });
        });
    }
  };

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("address", data.address);
      setValue("city", data.city);
      setValue("state", data.state);
      setValue("country", data.country);
      setValue("pincode", data.pincode);
      setValue("status", data.status == "active" ? true : false);
    } else {
      reset({
        name: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });
    }
  }, [data]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle> {isEdit ? "Edit Client" : "Add Client"}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={1}>
            <RHFTextField
              name="name"
              label="Client Name*"
              sx={{ marginTop: 2 }}
            />
            <RHFTextField name="address" label="Address" />
            <RHFTextField name="city" label="City" />
            <RHFTextField name="state" label="State" />
            <RHFSelect native name="country" label="Country">
              <option value="" />
              {countries.map((country) => (
                <option key={country.code} value={country.label}>
                  {country.label}
                </option>
              ))}
            </RHFSelect>
            <RHFTextField name="pincode" label="Pin Code" />
          </Stack>
          <Stack sx={{ mt: 2 }}>
            <RHFSwitch name="status" labelPlacement="start" label="Status" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            // onClick={()=>{
            //   console.log("hello")
            // }}
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
