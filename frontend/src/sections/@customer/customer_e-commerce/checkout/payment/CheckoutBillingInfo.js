import PropTypes from "prop-types";
import * as Yup from "yup";

// @mui
import {
  Card,
  Button,
  Box,
  MenuItem,
  Typography,
  Stack,
  Select,
  CardHeader,
  CardContent,
  TextField,
} from "@mui/material";
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadAvatar,
} from "src/components/hook-form";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import Iconify from "../../../../../components/iconify";
import { MuiTelInput } from "mui-tel-input";

import { useEffect, useState } from "react";
import { countries } from "src/assets/data";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// ----------------------------------------------------------------------

CheckoutBillingInfo.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object,
  onCreate: PropTypes.func,
};

export default function CheckoutBillingInfo({ title, data, onCreate }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isEditBillingAddress, setIsEditBillingAddress] = useState(false);

  const defaultValues = {
    name: "",
    mobile: "",
    country: "",
    address: "",
    city: "",
    state: "",
  };

  const FormSchema = Yup.object().shape({
    name: Yup.string().nullable().required("Name is required"),
    mobile: Yup.string().nullable().required("Contact is required"),
    address: Yup.string().nullable().required("Address is required"),
    city: Yup.string().nullable().required("City is required"),
    state: Yup.string().nullable().required("State is required"),
    country: Yup.string().nullable().required("Country is required"),
  });

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const handleSaveBillingAddress = () => {
    setIsEditBillingAddress(false);
  };

  useEffect(() => {
    setPhoneNumberError(errors.mobile?.message ?? "");
  }, [errors]);

  useEffect(() => {
    if (
      data?.name &&
      data?.mobile &&
      data?.address &&
      data?.city &&
      data?.state &&
      data?.country
    ) {
      setIsEditBillingAddress(false);
    } else {
      setIsEditBillingAddress(true);

      setValue("name", data?.name ?? "");
      setValue("mobile", data?.mobile ?? "");
      setValue("address", data?.address ?? "");
      setValue("city", data?.city ?? "");
      setValue("state", data?.state ?? "");
      setValue("country", data?.country ?? "");
    }
  }, [data]);

  const onSubmit = async (data) => {
    setIsEditBillingAddress(false);

    onCreate(data);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={title}
        action={
          !isEditBillingAddress && (
            <Button
              size="small"
              startIcon={<Iconify icon="eva:edit-fill" />}
              onClick={() => {
                setIsEditBillingAddress(true);

                setValue("name", data.name ?? "");
                setValue("mobile", data.mobile ?? "");
                setValue("address", data.address ?? "");
                setValue("city", data.city ?? "");
                setValue("state", data.state ?? "");
                setValue("country", data.country ?? "");
                setPhoneNumber(data.mobile ?? "");
              }}
            >
              Edit
            </Button>
          )
        }
      />
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {!isEditBillingAddress ? (
            <Stack>
              <Typography variant="subtitle2" gutterBottom>
                {data?.name}
              </Typography>

              <Typography variant="body2" gutterBottom>
                {`${data?.address ?? ""}  ${data?.city ?? ""}  ${
                  data?.state ?? ""
                } ${data?.country ?? ""}`}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {data?.mobile}
              </Typography>
            </Stack>
          ) : (
            <Stack>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                }}
              >
                <RHFTextField size="small" name="name" label="Name" />
                <MuiTelInput
                  size="small"
                  defaultCountry="IN"
                  name="phoneNumber"
                  value={phoneNumber}
                  label="Contact#"
                  onChange={(value) => {
                    setPhoneNumber(value);
                    setPhoneNumberError("");
                    setValue("mobile", value);
                  }}
                  error={Boolean(phoneNumberError)}
                  helperText={phoneNumberError}
                />
                <RHFTextField size="small" name="address" label="Address" />
                <RHFTextField size="small" name="state" label="State/Region" />
                <RHFTextField size="small" name="city" label="City" />
                <RHFSelect size="small" name="country" label="Country">
                  {countries.map((country) => (
                    <MenuItem key={country.code} value={country.label}>
                      {country.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Box>

              <Stack
                display="flex"
                justifyContent="flex-end"
                direction="row"
                spacing={1}
                sx={{ pt: 2 }}
              >
                <Button
                  variant="contained"
                  size="medium"
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={handleSaveBillingAddress}
                  color="error"
                >
                  cancel
                </Button>
              </Stack>
            </Stack>
          )}
        </FormProvider>
      </CardContent>
    </Card>
  );
}
