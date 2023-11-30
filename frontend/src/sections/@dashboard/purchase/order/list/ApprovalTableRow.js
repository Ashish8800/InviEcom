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

ApprovalTableRow.propTypes = {
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
};

export default function ApprovalTableRow({ row, selected, onViewRow }) {
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
            PO001234
          </Link>
        </TableCell>
        <TableCell align="left">RFQ000001</TableCell>
        <TableCell align="left">Priya</TableCell>
        <TableCell align="left">QUO22222</TableCell>
        <TableCell align="left">IPN00002</TableCell>
        <TableCell align="left">2000</TableCell>
        <TableCell align="left">Shekhar Singh</TableCell>

        <TableCell> 23/07/2023</TableCell>
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
            sx={{ color: "success.main" }}
          >
            <Iconify icon="eva:edit-fill" />
            Approval
          </MenuItem>
        </ViewGuard>
      </MenuPopover>
    </>
  );
}
