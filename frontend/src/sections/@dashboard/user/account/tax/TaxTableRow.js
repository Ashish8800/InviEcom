import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
  Link,
  Stack,
  Button,
  Divider,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from "@mui/material";
// utils
import { fDate } from "src/utils/formatTime";
import { fCurrency } from "src/utils/formatNumber";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { CustomAvatar } from "src/components/custom-avatar";
import MenuPopover from "src/components/menu-popover";
import ConfirmDialog from "src/components/confirm-dialog";
import { ViewGuard } from "src/auth/MyAuthGuard";

// ----------------------------------------------------------------------
TaxTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function TaxTableRow({
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
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">{row.rate}</TableCell>

        <ViewGuard
          orPermissions={["settings.tax.update", "settings.tax.delete"]}
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
        <ViewGuard permission="settings.tax.read">
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

        <ViewGuard permission="settings.tax.update">
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

        <ViewGuard permission="settings.tax.delete">
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
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleCloseConfirm();
              onDeleteRow();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
