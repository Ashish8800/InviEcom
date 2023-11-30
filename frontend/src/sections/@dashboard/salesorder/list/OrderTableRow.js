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
import { fDate } from "../../../../utils/formatTime";
import { fDateTime } from "../../../../utils/formatTime";
import { fCurrency } from "../../../../utils/formatNumber";
// components
import Label from "../../../../components/label";
import Iconify from "../../../../components/iconify";
import { CustomAvatar } from "../../../../components/custom-avatar";
import MenuPopover from "../../../../components/menu-popover";
import ConfirmDialog from "../../../../components/confirm-dialog";
import { ViewGuard } from "src/auth/MyAuthGuard";
import { formateCurrency, formateDate } from "src/utils";

// ----------------------------------------------------------------------
OrderTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function OrderTableRow({
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
    products,
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
          <TableCell align="left">
            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              onClick={window.checkPermission("sales.products.update")? onViewRow : ()=>{}}
              sx={{ cursor: "pointer" }}
            >
              {row.id}
            </Link>
          </TableCell>
        <TableCell align="left">
          <Typography>{formateDate(row.createdOn)}</Typography>
        </TableCell>
        <TableCell align="left">{row.customerName}</TableCell>

        <TableCell align="left">{products?.map((item) => `${item.name}, `)}</TableCell>

        <TableCell align="left">{formateCurrency(row.total)}</TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (row?.paymentStatus === "paid" && "success") ||
              (row?.paymentStatus === "unpaid" && "warning") ||
              (row?.paymentStatus === "overdue" && "error") ||
              "default"
            }
          >
            {row.paymentStatus ?? "unpaid"}
          </Label>
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (status === "delivered" && "success") ||
              (status === "shipped" && "warning") ||
              (status === "packed" && "warning") ||
              (status === "placed" && "warning") ||
              (status === "canceled" && "error") ||
              "default"
            }
          >
            {row.status}
          </Label>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />

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
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
