import { useState } from "react";
import { Outlet } from "react-router-dom";
// @mui
import { Box } from "@mui/material";
// hooks
import useResponsive from "../../hooks/useResponsive";
// components
import { useSettingsContext } from "../../components/settings";
//
import Main from "./Main";
import Header from "./header";
import NavMini from "./nav/NavMini";
import NavVertical from "./nav/NavVertical";
import NavHorizontal from "./nav/NavHorizontal";

import { useLocation } from "react-router-dom";
// @mui
import Footer from "src/layouts/customer/Footer";

import AuthLoginForm from "src/pages/customer/auth/AuthLoginForm";
import AuthRegisterForm from "src/pages/customer/auth/AuthRegisterForm";
import AuthResetPasswordForm from "src/pages/customer/auth/AuthResetPasswordForm";

// ----------------------------------------------------------------------

export default function CustomerLayout() {
  const { themeLayout } = useSettingsContext();

  const isDesktop = useResponsive("up", "lg");

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);

  const [open, setOpen] = useState(false);

  const isNavHorizontal = themeLayout === "horizontal";
  const isNavMini = themeLayout === "mini";

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openLoginModel = () => {
    setOpenLogin(true);
    setOpenRegister(false);
    setOpenForgot(false);
  };

  const openRegisterModel = () => {
    setOpenLogin(false);
    setOpenRegister(true);
    setOpenForgot(false);
  };

  const openForgetModel = () => {
    setOpenLogin(false);
    setOpenRegister(false);
    setOpenForgot(true);
  };

  const closeLoginModel = () => {
    setOpenLogin(false);
  };

  const closeRegisterModel = () => {
    setOpenRegister(false);
  };

  const closeForgetModel = () => {
    setOpenForgot(false);
  };

  window.openLoginModel = openLoginModel;
  window.openRegisterModel = openRegisterModel;
  window.openForgetModel = openForgetModel;

  window.closeLoginModel = closeLoginModel;
  window.closeRegisterModel = closeRegisterModel;
  window.closeForgetModel = closeForgetModel;

  const renderNavHorizontal = (
    <NavHorizontal openNav={open} onCloseNav={handleClose} />
  );

  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <>
      <Header onOpenNav={handleOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, md: 14 },
        }}
      >
        <Outlet />

        <Footer />
      </Box>

      <AuthLoginForm open={openLogin} onClose={window.closeLoginModel} />
      <AuthRegisterForm
        open={openRegister}
        onClose={window.closeRegisterModel}
      />
      <AuthResetPasswordForm
        open={openForgot}
        onClose={window.closeForgetModel}
      />
    </>
  );
}
