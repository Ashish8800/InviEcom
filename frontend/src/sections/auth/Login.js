// @mui
import { Stack, Typography } from "@mui/material";
// auth
// routes
// layouts
import LoginLayout from "../../layouts/login";
//
import AuthLoginForm from "./AuthLoginForm";

// ----------------------------------------------------------------------

export default function Login() {
  

  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">Sign In</Typography>
      </Stack>

      <AuthLoginForm />
    </LoginLayout>
  );
}
