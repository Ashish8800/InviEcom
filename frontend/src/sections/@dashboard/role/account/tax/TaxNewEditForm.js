import PropTypes from "prop-types";
import * as Yup from "yup";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  TextField,
  FormControlLabel,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers";
// utils
import { fData } from "src/utils/formatNumber";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// assets
import { countries } from "src/assets/data";
// components
import Label from "src/components/label";
import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadAvatar,
} from "src/components/hook-form";

// ----------------------------------------------------------------------
const INPUT_WIDTH = 160;

TaxNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function TaxNewEditForm({ isEdit = false, currentUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    phoneNumber: Yup.string().required("Phone number is required"),
    date: Yup.string().required("Date is required"),
    address: Yup.string().required("Address is required"),
    country: Yup.string().required("Country is required"),
    company: Yup.string().required("Company is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    role: Yup.string().required("Role is required"),
    avatarUrl: Yup.string().required("Avatar is required").nullable(true),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phoneNumber: currentUser?.phoneNumber || "",
      date: currentUser?.date || "",
      address: currentUser?.address || "",
      country: currentUser?.country || "",
      state: currentUser?.state || "",
      city: currentUser?.city || "",
      zipCode: currentUser?.zipCode || "",
      avatarUrl: currentUser?.avatarUrl || null,
      isVerified: currentUser?.isVerified || true,
      status: currentUser?.status,
      company: currentUser?.company || "",
      role: currentUser?.role || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? "Create success!" : "Update success!");
      navigate(PATH_DASHBOARD.user.list);
      console.log("DATA", data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("avatarUrl", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const convertDate = (Date) => {
    const yyyy = Date.getFullYear();
    let mm = Date.getMonth() + 1; // Months start at 0!
    let dd = Date.getDate();

    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack >
              <Typography variant="h6">GST Settings</Typography>
              <Typography>Is your business registered for GST?</Typography>

              <RHFRadioGroup
                row
                spacing={4}
                name="Deliver To"
                options={[
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                ]}
              />
            </Stack>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField name="gstIn" label="GSTIN*" />
              <Controller
                name="registeredDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="GST Registered On"
                    placeholder="GST Registered On"
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

              <RHFTextField name="legalName" label="Business Legal Name" />
              <RHFTextField name="tradeName" label="Business Trade Name" />
            </Box>
          </Stack>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
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
