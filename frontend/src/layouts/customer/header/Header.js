import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import { Stack, AppBar, Toolbar, IconButton } from "@mui/material";
// utils
import { bgBlur } from "../../../utils/cssStyles";
// hooks
import useOffSetTop from "../../../hooks/useOffSetTop";
import useResponsive from "../../../hooks/useResponsive";
// config
import { HEADER, NAV } from "../../../config-global";
// components
import Logo from "../../../components/logo";
import Iconify from "../../../components/iconify";
import { useSettingsContext } from "../../../components/settings";
//
import Searchbar from "./Searchbar";
import AccountPopover from "./AccountPopover";
import CartWidgetPopover from "./CartWidgetPopover";
import { NavSectionHorizontal } from "../../../components/nav-section";
import navConfig from "../nav/config-navigation";

import MobileSidebar from "../nav/MobileSidebar";
import { useSelector } from "src/redux/store";

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const theme = useTheme();

  const { totalItems } = useSelector((state) => state.cart);

  const { themeLayout } = useSettingsContext();

  const isNavHorizontal = themeLayout === "horizontal";

  const isNavMini = themeLayout === "mini";

  const isDesktop = useResponsive("up", "lg");

  const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP) && !isNavHorizontal;
  // =========it is used for nav vertical (responsive)============

  const [mobileSidebarOpenStatus, setMobileSidebarOpenStatus] = useState(false);

  const renderContent = (
    <>
      {isDesktop && <Logo sx={{ mr: 2.5 }} />}

      {!isDesktop && (
        <IconButton
          onClick={() => {
            setMobileSidebarOpenStatus(true);
          }}
          sx={{ mr: 1, color: "text.primary" }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      <Searchbar />

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 3 }}
      >
        {isDesktop && (
          <NavSectionHorizontal
            sx={{ width: "auto", marginLeft: 0, marginRight: 0 }}
            spacing={1}
            data={navConfig}
          />
        )}

        {!isDesktop && (
          <MobileSidebar
            openNav={mobileSidebarOpenStatus}
            onCloseNav={() => {
              setMobileSidebarOpenStatus(false);
            }}
          />
        )}

        <CartWidgetPopover totalItems={totalItems} />

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: "3",
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(["height"], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(isDesktop && {
          height: HEADER.H_DASHBOARD_DESKTOP,
          ...(isOffset && {
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: "background.default",
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
