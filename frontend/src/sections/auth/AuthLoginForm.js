import { useState } from "react";
import {
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Alert, IconButton, InputAdornment, Link, Stack } from "@mui/material";
// routes
import { PATH_AUTH } from "../../routes/paths";
// auth
// components
import { isAdminLoggedIn, saveAdmin } from "src/auth/utils";
import apiUrls from "src/routes/apiUrls";
import { Api } from "src/utils";
import FormProvider, { RHFTextField } from "../../components/hook-form";
import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urlSearchParams = useLocation().search;
  const urlParams = new URLSearchParams(urlSearchParams);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log(data);
    Api.post(apiUrls.auth.admin.login, data)
      .then((res) => {
        if (res.result) {
          saveAdmin(res.data);
          if (isAdminLoggedIn()) {
            window.Toast("You have logged in successfully");

            setTimeout(() => {
              if (urlParams.get("requestedLocation")) {
                window.location.replace(urlParams.get("requestedLocation"));
              } else {
                window.location.replace("/dashboard/app");
              }
            }, 1000);
          }
          setIsSubmitting(false);
        } else {
          window.ToastError(res.message);
          setIsSubmitting(false);
        }
      })
      .catch((err) => {
        window.ToastError("Something went wrong");
        setIsSubmitting(false);
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link
          component={RouterLink}
          to={PATH_AUTH.resetPassword}
          variant="body2"
          color="inherit"
          underline="always"
          sx={{ cursor: "pointer" }}
        >
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          bgcolor: "text.primary",
          color: (theme) =>
            theme.palette.mode === "light" ? "common.white" : "grey.800",
          "&:hover": {
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.800",
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
