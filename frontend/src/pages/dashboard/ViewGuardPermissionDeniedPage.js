import { Helmet } from "react-helmet-async";
import { useState } from "react";
// @mui
import {
  Box,
  Card,
  Container,
  Typography,
  CardHeader,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// components
import { useSettingsContext } from "../../components/settings";
import CustomBreadcrumbs from "../../components/custom-breadcrumbs";
// auth
import RoleBasedGuard from "../../auth/RoleBasedGuard";
import { useNavigate } from "react-router";

// ----------------------------------------------------------------------

export default function ViewGuardPermissionDeniedPage() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999999,
        backgroundColor: "rgba(0,0,0,0.5)",
        backgroundColor: "rgba(255, 255, 255, .01)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <p>
          Forbidden Error: May be you don't have permission to see this page.
        </p>
        <Button
          size="medium"
          variant="contained"
          onClick={() => {
            navigate(PATH_DASHBOARD.root);
          }}
        >
          Go to Dashboard
        </Button>
      </Box>
    </div>
  );
}
