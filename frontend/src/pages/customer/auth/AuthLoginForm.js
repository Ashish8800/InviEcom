import { useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { Link as RouterLink } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Link,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// routes
import { PATH_AUTH } from "src/routes/paths";
// auth
import { useAuthContext } from "src/auth/useAuthContext";
// components
import Iconify from "src/components/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import RestApiClient from "src/utils/RestApiClient";

import apiUrls from "src/routes/apiUrls";
import { Api } from "src/utils";
import { saveCustomer } from "src/auth/utils";

// ----------------------------------------------------------------------
AuthLoginForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
export default function AuthLoginForm({ open, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

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
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    setLoadingSend(true);

    Api.post(apiUrls.website.auth.login, data)
      .then((response) => {
        if (response.result) {
          window.Toast("You have logged in successfully.");
          saveCustomer(response.data.token);
          reset({ ...defaultValues });
          window.location.reload();
        } else {
          window.ToastError(response.message);
        }
      })
      .catch(() => {});
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ mb: 1 }}>Sign In</DialogTitle>

        <DialogContent>
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Typography variant="body2">New user?</Typography>

            <Link
              onClick={window.openRegisterModel}
              variant="subtitle2"
              sx={{ cursor: "pointer" }}
            >
              Create an account
            </Link>
          </Stack>
          <Stack spacing={3} sx={{ pt: 1 }}>
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
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>

        <Stack alignItems="flex-end" sx={{ m: 3 }}>
          <Link
            onClick={window.openForgetModel}
            variant="body2"
            color="inherit"
            underline="always"
            sx={{ cursor: "pointer" }}
          >
            Forgot password?
          </Link>
        </Stack>
        <DialogActions>
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={loadingSend && isSubmitting}
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
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
