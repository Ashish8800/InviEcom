import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { Stack, Card } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../../components/iconify";
import { useSnackbar } from "../../../../components/snackbar";
import FormProvider, { RHFTextField } from "../../../../components/hook-form";
import User from "src/controller/userManagement/User.controller";
import { adminId } from "src/auth/utils";

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Old Password is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New Password is required"),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const defaultValues = {
    currentPassword: "",
    password: "",
    confirmNewPassword: "",
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    delete data.confirmNewPassword;
    data.id = adminId();

    User.updatePassword(data)
      .then((res) => {
        console.log(res);
        reset();
        window.Toast("Your password updated successfully");
      })
      .catch((err) => {
        window.ToastError(err.message);
      });

    console.log("DATA", data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
          <RHFTextField
            name="currentPassword"
            type="password"
            label="Current Password"
          />

          <RHFTextField
            name="password"
            type="password"
            label="New Password"
            helperText={
              <Stack component="span" direction="row" alignItems="center">
                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} />{" "}
                Password must be minimum 6+
              </Stack>
            }
          />

          <RHFTextField
            name="confirmNewPassword"
            type="password"
            label="Confirm New Password"
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
