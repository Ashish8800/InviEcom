import { useFormContext } from "react-hook-form";
import { useState } from "react";
// @mui
// utils
// components
import { RHFTextField } from "src/components/hook-form";
import { LoadingButton } from "@mui/lab";
import Iconify from "src/components/iconify";
import {
  Link,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
 
} from "@mui/material";

// ----------------------------------------------------------------------

export default function EmailSection({ handleSubmit, isSubmitting }) {
  const { setValue, methods } = useFormContext();
  const [showOtp, setShowOtp] = useState(false);

  const otpSubmition = () => {
    setValue("action", "verify-otp");
    handleSubmit();
  };

  return (
    <Stack>
      <RHFTextField
       
        name="otp"
        label=" Send OTP"
        type={showOtp ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowOtp(!showOtp)} edge="end">
                <Iconify icon={showOtp ? "eva:eye-fill" : "eva:eye-off-fill"} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* <LoadingButton
        fullWidth
        size="medium"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 2 }}
        onClick={otpSubmition}
      >
        SUBMIT OTP
      </LoadingButton> */}
    </Stack>
  );
}
