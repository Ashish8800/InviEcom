import * as Yup from "yup";
import { useCallback } from "react";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// auth
// utils
import { fData } from "../../../../utils/formatNumber";
// assets
import { countries } from "../../../../assets/data";
// components
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../../components/hook-form";

import { MuiTelInput } from "mui-tel-input";
import { useState } from "react";
import { useEffect } from "react";
import User from "src/controller/userManagement/User.controller";
import { adminId } from "src/auth/utils";
import { fileToBase64 } from "src/utils";

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    avatarUrl: Yup.string().required("Avatar is required").nullable(true),
    phoneNumber: Yup.string().required("Phone number is required"),
    country: Yup.string().required("Country is required"),
    address: Yup.string().required("Address is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
  });

  const defaultValues = {
    name: "",
    email: "",
    avatarUrl: "",
    phoneNumber: "",
    country: "",
    address: "",
    state: "",
    city: "",
    about: "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const loadProfile = () => {
    User.get(adminId())
      .then((res) => {
        reset({
          ...res,
        });
        setPhoneNumber(res.phoneNumber);
      })
      .catch((err) => console.log(err));
  };

  const onSubmit = async (data) => {
    try {
      data.avataUrl = await fileToBase64(data.avataUrl);
    } catch (error) {
      console.log(error.message);
    }

    User.update(data)
      .then((res) => {
        window.Toast("Profile updated successfully");
        loadProfile();
      })
      .catch((err) => {
        console.log(err.message);
      });

    console.log("DATA", data);
  };

  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue("avatarUrl", await fileToBase64(file), {
        shouldValidate: true,
      });
    }
  };

  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneChange = (newNumber) => {
    setPhoneNumber(newNumber);
    setValue("phoneNumber", newNumber);
  };

  useEffect(loadProfile, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
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
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
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

              <MuiTelInput
                defaultCountry="IN"
                name="phoneNumber"
                value={phoneNumber}
                label="Contact#"
                onChange={handlePhoneChange}
              />

              <RHFTextField name="address" label="Address" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="state" label="State/Region" />

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
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="About" />

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
