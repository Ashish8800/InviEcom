import { Helmet } from "react-helmet-async";
import { useState } from "react";
// @mui
import { Card, Container } from "@mui/material";
// routes
import { PATH_CUSTOMER } from "../../../routes/paths";
import PropTypes from "prop-types";
// auth
import { useAuthContext } from "../../../auth/useAuthContext";
// _mock_

import {
  Button,
  Typography,
  Stack,
  Grid,
  Select,
  CardHeader,
  CardContent,
} from "@mui/material";
import FormProvider, {
  RHFTextField,
  RHFSelect,
} from "src/components/hook-form";
// components
import Iconify from "../../../components/iconify";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../components/settings";
import { LoadingButton } from "@mui/lab";
// sections

import { MuiTelInput } from "mui-tel-input";
import { countries } from "src/assets/data";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import RestApiClient from "src/utils/RestApiClient";
import apiUrls from "src/routes/apiUrls";
import { useEffect } from "react";
import { useSnackbar } from "src/components/snackbar";
import Profile from "src/controller/customer/Profile.controller";
import { Api } from "src/utils";
import CustomerProfileChangePassword from "./CustomerProfileChangePassword";
import { customerId } from "src/auth/utils";
import {
  getLoggedInCustomer,
  isCustomerLoggedIn,
  logoutCustomer,
} from "src/auth/utils";
// ----------------------------------------------------------------------
CustomerProfilePage.propTypes = {
  billing: PropTypes.object,
  onBackStep: PropTypes.func,
};

export default function CustomerProfilePage(billing, onBackStep, data) {
  window.authorizedCustomerOnly();
  const { themeStretch } = useSettingsContext();
  const user = getLoggedInCustomer();
  // const { user } = useAuthContext();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isEditBillingAddress, setIsEditBillingAddress] = useState(false);
  const [requestError, setRequestError] = useState("");
  const handleSaveBillingAddress = () => {
    setIsEditBillingAddress(true);

    setValue("id", customerData?.id);
    setValue("firstName", customerData?.firstName);
    setValue("lastName", customerData?.lastName);
    setValue("email", customerData?.email);
    setValue("mobile", customerData?.mobile);
    setValue("role", customerData?.role);
    setValue("organization", customerData?.organization);
    setValue("country", customerData?.country);

    setValue("billing.address", customerData?.billing?.address);
    setValue("billing.city", customerData?.billing?.city);
    setValue("billing.state", customerData?.billing?.state);
    setValue("billing.country", customerData?.billing?.country);
    setValue("shipping.address", customerData?.shipping?.address);
    setValue("shipping.city", customerData?.shipping?.city);
    setValue("shipping.state", customerData?.shipping?.state);
    setValue("shipping.country", customerData?.shipping?.country);
    setValue("isDefault", customerData?.status == "active" ? true : false);
    setPhoneNumber(customerData?.mobile);
  };
  let isEdit = typeof data == "object" ? true : false;

  const [showPassword, setShowPassword] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    role: "",
    organization: "",
    country: "",
    status: "",

    billing: {
      country: "",
      address: "",
      city: "",
      state: "",
    },

    shipping: {
      country: "",
      address: "",
      city: "",
      state: "",
    },
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    setError,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;
  const { enqueueSnackbar } = useSnackbar();
  const [customerData, setCustomerData] = useState("");

  const onSubmit = async (data) => {
    Api.put(apiUrls.customer.update(customerId()), data)
      .then((res) => {
        if (res.result) {
          window.Toast("Your profile updated successfully");
          setIsEditBillingAddress(false);

          Api.get(apiUrls.customer.get(customerId())).then((res) => {
            setCustomerData(res.data);
          });
        } else {
          window.ToastError(res.message);
        }
        // setLoadingSend(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    Api.get(apiUrls.customer.get(customerId())).then((res) => {
      setCustomerData(res.data);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title> User: Account</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="My Account"
          links={[
            { name: "Home", href: PATH_CUSTOMER.root },
            { name: "User", href: PATH_CUSTOMER.user.root },
            { name: user?.name },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ mb: 2 }}>
            <CardHeader
              // title="Billing Address"
              action={
                !isEditBillingAddress && (
                  <Button
                    size="small"
                    startIcon={<Iconify icon="eva:edit-fill" />}
                    onClick={handleSaveBillingAddress}
                  >
                    Edit
                  </Button>
                )
              }
            />
            <CardContent>
              {!isEditBillingAddress ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    {" "}
                    <Stack>
                      <Stack direction="row">
                        <Typography
                          paragraph
                          sx={{ color: "text.disabled", pr: 1 }}
                        >
                          User ID:
                        </Typography>
                        <Typography>{customerData?.id}</Typography>
                      </Stack>
                      <Stack direction="row">
                        <Typography
                          paragraph
                          sx={{ color: "text.disabled", pr: 1 }}
                        >
                          Name:
                        </Typography>
                        <Typography>
                          {customerData?.firstName} {customerData?.lastName}
                        </Typography>
                      </Stack>
                      <Stack direction="row">
                        <Typography
                          paragraph
                          sx={{ color: "text.disabled", pr: 1 }}
                        >
                          Email Id:
                        </Typography>
                        <Typography>{customerData?.email}</Typography>
                      </Stack>
                      <Stack direction="row">
                        <Typography
                          paragraph
                          sx={{ color: "text.disabled", pr: 1 }}
                        >
                          Contact Number:
                        </Typography>
                        <Typography>{customerData?.mobile}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack>
                      <Stack direction="row">
                        <Typography
                          paragraph
                          sx={{ color: "text.disabled", pr: 1 }}
                        >
                          Job Role:
                        </Typography>
                        <Typography>{customerData?.role}</Typography>
                      </Stack>
                      <Stack direction="row">
                        <Typography
                          paragraph
                          sx={{ color: "text.disabled", pr: 1 }}
                        >
                          Organization:
                        </Typography>
                        <Typography>{customerData?.organization}</Typography>
                      </Stack>
                      <Stack direction="row">
                        <Typography
                          paragraph
                          sx={{ color: "text.disabled", pr: 1 }}
                        >
                          Country:
                        </Typography>
                        <Typography>{customerData?.country}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card>
                      <Stack sx={{ pl: 3 }}>
                        <Stack sx={{ pb: 2, pt: 2 }}>
                          <Typography variant="h6">Billing Address</Typography>
                        </Stack>
                        <Stack direction="row">
                          <Typography
                            paragraph
                            sx={{ color: "text.disabled", pr: 1 }}
                          >
                            Address:
                          </Typography>
                          <Typography>
                            {customerData?.billing?.address}
                          </Typography>
                        </Stack>
                        <Stack direction="row">
                          <Typography
                            paragraph
                            sx={{ color: "text.disabled", pr: 1 }}
                          >
                            City:
                          </Typography>
                          <Typography>{customerData?.billing?.city}</Typography>
                        </Stack>
                        <Stack direction="row">
                          <Typography
                            paragraph
                            sx={{ color: "text.disabled", pr: 1 }}
                          >
                            State:
                          </Typography>
                          <Typography>
                            {customerData?.billing?.state}
                          </Typography>
                        </Stack>
                        <Stack direction="row">
                          <Typography
                            paragraph
                            sx={{ color: "text.disabled", pr: 1 }}
                          >
                            Country:
                          </Typography>
                          <Typography>
                            {customerData?.billing?.country}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <Stack sx={{ pl: 3 }}>
                        <Stack sx={{ pb: 2, pt: 2 }}>
                          <Typography variant="h6">Shipping Address</Typography>
                        </Stack>
                        <Stack direction="row">
                          <Typography
                            paragraph
                            sx={{ color: "text.disabled", pr: 1 }}
                          >
                            Address:
                          </Typography>
                          <Typography>
                            {customerData?.shipping?.address}
                          </Typography>
                        </Stack>
                        <Stack direction="row">
                          <Typography
                            paragraph
                            sx={{ color: "text.disabled", pr: 1 }}
                          >
                            City:
                          </Typography>
                          <Typography>
                            {customerData?.shipping?.city}
                          </Typography>
                        </Stack>
                        <Stack direction="row">
                          <Typography
                            paragraph
                            sx={{ color: "text.disabled", pr: 1 }}
                          >
                            State:
                          </Typography>
                          <Typography>
                            {customerData?.shipping?.state}
                          </Typography>
                        </Stack>
                        <Stack direction="row">
                          <Typography
                            paragraph
                            sx={{ color: "text.disabled", pr: 1 }}
                          >
                            Country:
                          </Typography>
                          <Typography>
                            {customerData?.shipping?.country}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <RHFTextField
                          disabled={true}
                          size="small"
                          name="id"
                          label="User ID"
                        ></RHFTextField>
                        <RHFTextField
                          size="small"
                          name="firstName"
                          label="First Name"
                        ></RHFTextField>
                        <RHFTextField
                          size="small"
                          name="lastName"
                          label="Last Name"
                        ></RHFTextField>
                        <RHFTextField
                          size="small"
                          name="email"
                          label="Email ID"
                        ></RHFTextField>
                        <MuiTelInput
                          size="small"
                          defaultCountry="IN"
                          name="phoneNumber"
                          value={phoneNumber}
                          label="Contact"
                          onChange={(value) => {
                            setPhoneNumber(value);
                            setPhoneNumberError("");
                            setValue("mobile", value);
                          }}
                          error={Boolean(phoneNumberError)}
                          helperText={phoneNumberError}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <RHFTextField
                          size="small"
                          name="role"
                          label="Job Role"
                        ></RHFTextField>
                        <RHFTextField
                          size="small"
                          name="organization"
                          label="Organization"
                        ></RHFTextField>
                        <RHFSelect
                          native
                          size="small"
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
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card>
                        <Stack sx={{ p: 3 }} spacing={2}>
                          <Stack sx={{ pb: 2 }}>
                            <Typography variant="h6">
                              Billing Address
                            </Typography>
                          </Stack>
                          <RHFTextField
                            size="small"
                            name="billing.address"
                            label="Address"
                          ></RHFTextField>
                          <RHFTextField
                            size="small"
                            name="billing.city"
                            label="City"
                          ></RHFTextField>
                          <RHFTextField
                            size="small"
                            name="billing.state"
                            label="State"
                          ></RHFTextField>
                          <RHFSelect
                            native
                            size="small"
                            name="billing.country"
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
                        </Stack>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <Stack sx={{ p: 3 }} spacing={2}>
                          <Stack sx={{ pb: 2 }}>
                            <Typography variant="h6">
                              Shipping Address
                            </Typography>
                          </Stack>
                          <RHFTextField
                            size="small"
                            name="shipping.address"
                            label="Address"
                          ></RHFTextField>
                          <RHFTextField
                            size="small"
                            name="shipping.city"
                            label="City"
                          ></RHFTextField>
                          <RHFTextField
                            size="small"
                            name="shipping.state"
                            label="State"
                          ></RHFTextField>
                          <RHFSelect
                            native
                            size="small"
                            name="shipping.country"
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
                        </Stack>
                      </Card>
                    </Grid>
                  </Grid>

                  <Stack
                    display="flex"
                    justifyContent="flex-end"
                    direction="row"
                    sx={{ pt: 2 }}
                    spacing={2}
                  >
                    <LoadingButton
                      variant="contained"
                      size="medium"
                      loading={isSubmitting}
                      type="submit"
                    >
                      Save
                    </LoadingButton>
                    <LoadingButton
                      color="error"
                      variant="contained"
                      size="medium"
                      onClick={() => {
                        setIsEditBillingAddress(false);
                      }}
                    >
                      cancel
                    </LoadingButton>
                  </Stack>
                </Stack>
              )}
            </CardContent>
          </Card>
        </FormProvider>
      </Container>
      <CustomerProfileChangePassword />
    </>
  );
}
