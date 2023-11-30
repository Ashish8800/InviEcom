import { useFormContext } from "react-hook-form";
// @mui
import {
  Stack,
} from "@mui/material";
// utils
// components
import {
  RHFTextField,
} from "src/components/hook-form";
import { LoadingButton } from "@mui/lab";


// ----------------------------------------------------------------------

export default function EmailSection({handleSubmit,isSubmitting}) {
  const { setValue,methods } = useFormContext();

  


  const startSubmition = ()=>{
    setValue('action', 'verify');
    handleSubmit();
  }


  return (
    <Stack sx={{ p: 2 }}>
      <RHFTextField  name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 2 }}
        onClick={startSubmition}
      >
        SEND OTP
      </LoadingButton>
    </Stack>
  );
}
