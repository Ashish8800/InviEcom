import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
// routes
// components
import FormProvider, { RHFTextField } from "../../components/hook-form";
import { Api } from "src/utils";
import apiUrls from "src/routes/apiUrls";

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: "" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);
    Api.post(apiUrls.userManagement.user.forgetPassword, data)
      .then((res) => {
        if (res.result) {
          reset({
            email: "",
          });
          window.Toast(
            "We send an email to reset you password at your registered email "
          );
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        Send Request
      </LoadingButton>
    </FormProvider>
  );
}
