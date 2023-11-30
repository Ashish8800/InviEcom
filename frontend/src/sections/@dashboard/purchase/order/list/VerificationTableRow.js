import PropTypes from "prop-types";
// @mui
import { IconButton, Link, MenuItem, TableCell, TableRow } from "@mui/material";
// utils
// components
import { useState } from "react";
import { ViewGuard } from "src/auth/MyAuthGuard";
import Iconify from "src/components/iconify/Iconify";
import MenuPopover from "src/components/menu-popover";

// ----------------------------------------------------------------------

VerificationTableRow.propTypes = {
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
};

export default function VerificationTableRow({ row, selected, onViewRow }) {
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="left">
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: "pointer" }}
          >
            PO22000001
          </Link>
        </TableCell>
        <TableCell align="left">RFQ99900002</TableCell>
        <TableCell align="left">Dev Singh</TableCell>
        <TableCell align="left">QUO000111</TableCell>
        <TableCell align="left">IPN20230710002</TableCell>
        <TableCell align="left">5000</TableCell>
        <TableCell align="left">Shruti </TableCell>
        <TableCell align="left">20/07/2023</TableCell>
        <ViewGuard
          orPermissions={[
            "purchase.purchase_order.update",
            "purchase.purchase_order.delete",
            "purchase.purchase_order.read",
          ]}
        >
          <TableCell align="left">
            <IconButton
              color={openPopover ? "inherit" : "default"}
              onClick={handleOpenPopover}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        </ViewGuard>
      </TableRow>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <ViewGuard permission="purchase.purchase_order.update">
          <MenuItem
            onClick={() => {
              onViewRow();
              handleClosePopover();
            }}
            sx={{ color: "warning.main" }}
          >
            <Iconify icon="eva:edit-fill" />
            Verify
          </MenuItem>
        </ViewGuard>
      </MenuPopover>
    </>
  );
}
