import PropTypes from "prop-types";
import * as Yup from "yup";
import { useEffect } from "react";
// form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import { Box, Grid, Stack, Typography, TextField } from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers";
import FormProvider, {
  RHFTextField,
  RHFRadioGroup,
} from "src/components/hook-form";
import { useState } from "react";
import { Api } from "src/utils";
import apiUrls from "src/routes/apiUrls";
// ----------------------------------------------------------------------

TaxNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function TaxNewEditForm({
  isEdit = false,
  currentUser,
  open,
  data,
  onClose,
}) {
  const [gstFormField, setGstFormField] = useState(true);

  const NewUserSchema = Yup.object().shape({
    gstNumber: Yup.string().required("GSTIN* is required"),
    registeredDate: Yup.string().required("Date is required"),
    legalName: Yup.string().required(" Legal Name is required"),
    tradeName: Yup.string().required("Trade Name is required"),
  });

  const defaultValues = {
    gstNumber: "",
    registeredDate: null,
    legalName: "",
    tradeName: "",
    gst: "no",
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    if (data.gst == "no") {
      setValue("gstNumber", "");
      setValue("registeredDate", null);
      setValue("legalName", "");
      setValue("tradeName", "");

      data.gstNumber = "";
      data.registeredDate = "";
      data.legalName = "";
      data.tradeName = "";
    }

    Api.put(apiUrls.settings.tax.update, data)
      .then((res) => {
        if (res.result) {
          window.Toast("GST details updated successfully");
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((error) => error);
  };

  const handleChange = (e, value) => {
    setValue("gst", value);
    if (value === "no") {
      setGstFormField(true);
    } else {
      setGstFormField(false);
    }
  };

  useEffect(() => {
    if (values.gst === "yes") {
      setGstFormField(false);
    } else {
      setGstFormField(true);
    }
  }, [values.gst]);

  useEffect(() => {
    Api.get(apiUrls.settings.tax.index)
      .then((res) => {
        if (res.result) {
          setValue("gstNumber", res.data.gstNumber);
          setValue("registeredDate", res.data.registeredDate);
          setValue("legalName", res.data.legalName);
          setValue("tradeName", res.data.tradeName);
          setValue("gst", res.data.gstEnabled ? "yes" : "no");
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((error) => error);
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack>
              <Typography variant="h6">GST Settings</Typography>
              <Typography>Is your business registered for GST?</Typography>

              <RHFRadioGroup
                row
                spacing={4}
                name="gst"
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
                onChange={handleChange}
              />
            </Stack>
           {!gstFormField && <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField
                name="gstNumber"
                label="GSTIN*"
                disabled={gstFormField}
              />
              <Controller
                name="registeredDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    disabled={gstFormField}
                    label="GST Registered On"
                    placeholder="GST Registered On"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        disabled={gstFormField}
                        {...params}
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />

              <RHFTextField
                name="legalName"
                label="Business Legal Name"
                disabled={gstFormField}
              />
              <RHFTextField
                name="tradeName"
                label="Business Trade Name"
                disabled={gstFormField}
              />
            </Box>}
          </Stack>

          <Stack alignItems="flex-end" sx={{ p: 2}}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save
            </LoadingButton>
            
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
