import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
  Button,
  Divider,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
} from "@mui/material";
// utils
// components
import Iconify from "../../../../components/iconify";
import MenuPopover from "../../../../components/menu-popover";
import ConfirmDialog from "../../../../components/confirm-dialog";
import { ViewGuard } from "src/auth/MyAuthGuard";

// ----------------------------------------------------------------------
VendorTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function VendorTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const {
    sent,
    invoiceNumber,
    createDate,
    dueDate,
    status,
    invoiceTo,
    totalPrice,
  } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="left">{row.vendorDisplayName}</TableCell>
        <TableCell align="left">{row.companyName}</TableCell>
        <TableCell align="left">{row.vendorEmail}</TableCell>
        <TableCell align="left">{row.phoneNumber}</TableCell>

        <ViewGuard
          orPermissions={["purchase.vendor.update", "purchase.vendor.delete","purchase.vendor.read"]}
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
        <ViewGuard permission="purchase.vendor.read">
          <MenuItem
            onClick={() => {
              onViewRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:eye-fill" />
            View
          </MenuItem>
        </ViewGuard>
        <ViewGuard permission="purchase.vendor.update">
          <MenuItem
            onClick={() => {
              onEditRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>
        </ViewGuard>

        <Divider sx={{ borderStyle: "dashed" }} />

        <ViewGuard permission="purchase.vendor.delete">
          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="eva:trash-2-outline" />
            Delete
          </MenuItem>
        </ViewGuard>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow} >
            Delete
          </Button>
        }
      />
    </>
  );
}

