import PropTypes from "prop-types";
import * as Yup from "yup";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  MenuItem,
  Typography,
  FormControlLabel,
} from "@mui/material";
// utils
import { fData } from "../../../utils/formatNumber";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// assets
import { countries } from "../../../assets/data";
// components
import Label from "../../../components/label";
import { useSnackbar } from "../../../components/snackbar";
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadAvatar,
} from "../../../components/hook-form";
import { MuiTelInput } from "mui-tel-input";

// ----------------------------------------------------------------------
const ROLE_OPTIONS = [
  "all",
  "ux designer",
  "full stack designer",
  "backend developer",
  "project manager",
  "leader",
  "ui designer",
  "ui/ux designer",
  "front end developer",
  "full stack developer",
];

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit = false, currentUser }) {
  const navigate = useNavigate();
  const [loadingSave, setLoadingSave] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    phoneNumber: Yup.string().required("Phone number is required"),
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

  const handleSaveAsDraft = async (data) => {
    reset();
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.purchase.request.root);
  };

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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {isEdit && (
              <Label
                color={values.status === "active" ? "success" : "error"}
                sx={{
                  textTransform: "uppercase",
                  position: "absolute",
                  top: 24,
                  right: 24,
                }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {/* {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== "active"}
                        onChange={(event) =>
                          field.onChange(
                            event.target.checked ? "banned" : "active"
                          )
                        }
                      />
                    )}
                  />
                }
                // label={
                //   <>
                //     <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                //       Banned
                //     </Typography>
                //     <Typography
                //       variant="body2"
                //       sx={{ color: "text.secondary" }}
                //     >
                //       Apply disable account
                //     </Typography>
                //   </>
                // }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: "space-between" }}
              />
            )} */}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack>
              {isEdit && (
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    User ID:
                  </Typography>
                  <Typography>098765</Typography>
                </Stack>
              )}
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
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFSelect
                fullWidth
                name="role"
                label="Role"
                // InputLabelProps={{ shrink: true }}
              >
                {ROLE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
              {/* <RHFTextField name="role" label="Role">
                {ROLE_OPTIONS.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{
                      mx: 1,
                      borderRadius: 0.75,
                      typography: "body2",
                      textTransform: "capitalize",
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </RHFTextField> */}
              <MuiTelInput
                defaultCountry="IN"
                name="phoneNumber"
                value={phoneNumber}
                label="Contact#"
                onChange={(value) => {
                  setPhoneNumber(value);
                  setPhoneNumberError("");
                  setValue("phoneNumber", value);
                }}
                error={Boolean(phoneNumberError)}
                helperText={phoneNumberError}
              />
              <RHFTextField name="address" label="Address" />
              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />

              <RHFSelect
                native
                name="country"
                label="Country"
                placeholder="Country"
              >
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="pin" label="PIN" />
              <Stack direction="row">
                <Typography paragraph sx={{ pr: 2, pt: 1 }}>
                  Status:
                </Typography>
                <RHFRadioGroup
                  row
                  spacing={2}
                  name="Status"
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                />
              </Stack>
            </Box>

            <Stack
              justifyContent="flex-end"
              direction="row"
              spacing={2}
              sx={{ mt: 3 }}
            >
              {/* <LoadingButton
          color="inherit"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </LoadingButton> */}

              <LoadingButton
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {!isEdit ? "Add " : "Add"}
              </LoadingButton>

              <LoadingButton
                color="error"
                size="large"
                variant="contained"
                loading={loadingSave && isSubmitting}
                onClick={handleSaveAsDraft}
              >
                Cancel
              </LoadingButton>
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}></Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
