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
import { customerId } from "src/auth/utils";
// ----------------------------------------------------------------------

export default function CustomerProfileChangePassword() {
  const { themeStretch } = useSettingsContext();

  const { user } = useAuthContext();

  const [isEditBillingAddress, setIsEditBillingAddress] = useState(false);
  const [requestError, setRequestError] = useState("");

  const handleSaveBillingAddress = () => {
    setIsEditBillingAddress(true);

    setValue("id", customerData?.id);
    setValue("password", customerData?.password);
    setValue("newPassword", customerData?.newPassword);
  };
  let isEdit = typeof data == "object" ? true : false;

  const [showPassword, setShowPassword] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const defaultValues = {
    password: "",
    newPassword: "",
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
    setLoadingSend(true);

    Api.put(apiUrls.customer.changePassword, {
      ...data,
      id: customerId(),
    })
      .then((res) => {
        if (res.result) {
          reset({ ...defaultValues });
          window.Toast("Your password changed");
        } else {
          window.ToastError(res.message);
        }
        setLoadingSend(false);
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
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Container maxWidth={themeStretch ? false : "lg"}>
          <Card sx={{ p: 2 }}>
            <Stack>
              <Typography variant="h6">Credentials</Typography>
            </Stack>

            <Stack
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
              sx={{ pt: 2 }}
            >
              <RHFTextField
                size="small"
                name="password"
                label="Current Password"
              >
                {customerData?.password}
              </RHFTextField>
              <RHFTextField
                size="small"
                name="newPassword"
                label="New Password"
              ></RHFTextField>
            </Stack>

            <Stack
              sx={{ pt: 1 }}
              display="flex"
              justifyContent="flex-end"
              direction="row"
            >
              <LoadingButton
                variant="contained"
                size="medium"
                loading={loadingSend && isSubmitting}
                type="submit"
              >
                Change Password
              </LoadingButton>
            </Stack>
          </Card>
        </Container>
      </FormProvider>
    </>
  );
}
