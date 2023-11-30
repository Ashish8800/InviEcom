import PropTypes from "prop-types";
import { useState } from "react";
// @mui

import { IconButton, Link, MenuItem, TableCell, TableRow } from "@mui/material";
// utils
// components
import { ViewGuard } from "src/auth/MyAuthGuard";
import Iconify from "src/components/iconify/Iconify";
import MenuPopover from "src/components/menu-popover";

// ----------------------------------------------------------------------

CorrectionTableRow.propTypes = {
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
};

export default function CorrectionTableRow({ row, selected, onViewRow }) {
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
            PO00123456
          </Link>
        </TableCell>
        <TableCell align="left">RFQ00123</TableCell>
        <TableCell align="left">abhay mishra</TableCell>
        <TableCell align="left">QUO1234</TableCell>
        {/* <TableCell align="left">20/7/2023</TableCell> */}
        <TableCell align="left">IPN09745</TableCell>
        <TableCell align="left">1000</TableCell>
        <TableCell align="left">Shashank</TableCell>
        <TableCell align="left">20/7/2023</TableCell>
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
            sx={{ color: "error.main" }}
          >
            <Iconify icon="eva:edit-fill" />
            Modify
          </MenuItem>
        </ViewGuard>
      </MenuPopover>
    </>
  );
}
