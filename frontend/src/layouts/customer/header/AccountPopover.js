import { useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import { alpha } from "@mui/material/styles";
import { Box, Divider, Typography, Stack, MenuItem } from "@mui/material";
// routes
import { PATH_CUSTOMER } from "../../../routes/paths";
// auth
// components
import { CustomAvatar } from "../../../components/custom-avatar";
import MenuPopover from "../../../components/menu-popover";
import { IconButtonAnimate } from "../../../components/animate";

import {
  getLoggedInCustomer,
  isCustomerLoggedIn,
  logoutCustomer,
} from "src/auth/utils";

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: "My Account",
    linkTo: PATH_CUSTOMER.user.profile,
  },
  {
    label: "Order History",
    linkTo: PATH_CUSTOMER.order.history,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  let user = getLoggedInCustomer();
  
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleClickItem = (option) => {
    handleClosePopover();
    navigate(option.linkTo);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <CustomAvatar
          src={
            user?.photoURL ?? isCustomerLoggedIn()
              ? ""
              : "/assets/icons/navbar/ic_user_profile.svg"
          }
          alt={user?.name}
          name={user?.name}
        />
      </IconButtonAnimate>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        sx={{ width: 200, p: 0 }}
      >
        {!isCustomerLoggedIn() && (
          <Stack sx={{ p: 1 }}>
            <MenuItem onClick={window.openRegisterModel}>Sign Up </MenuItem>
            <MenuItem onClick={window.openLoginModel}>Sign In</MenuItem>
          </Stack>
        )}

        {isCustomerLoggedIn() && (
          <>
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                {user?.name}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {user?.email}
              </Typography>
            </Box>
            <Divider sx={{ borderStyle: "dashed" }} />

            <Stack sx={{ p: 1 }}>
              {OPTIONS.map((option) => (
                <MenuItem
                  key={option.label}
                  onClick={() => handleClickItem(option)}
                >
                  {option.label}
                </MenuItem>
              ))}

              <Divider sx={{ borderStyle: "dashed" }} />

              <MenuItem onClick={logoutCustomer}>Logout</MenuItem>
            </Stack>
          </>
        )}
      </MenuPopover>
    </>
  );
}
