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
import PaymentUpdateForm from "src/pages/dashboard/purchase/PaymentUpdateForm";
import { formateCurrency, formateDate } from "src/utils";
import { ViewGuard } from "src/auth/MyAuthGuard";
// ----------------------------------------------------------------------
InvoiceTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function InvoiceTableRow({
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
  const [purchaseInvoiceObj, setPurchaseInvoiceObj] = useState({});
  const [paymentOpen, setPaymentOpen] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handlePaymentOpen = () => {
    console.log(purchaseInvoiceObj);
    setPaymentOpen(true);
  };

  const handlePaymentClose = () => {
    setPurchaseInvoiceObj({});
    setPaymentOpen(false);
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
        <TableCell align="left">{row.id}</TableCell>
        <TableCell align="left">{row.vendorName}</TableCell>
        <TableCell align="left">{formateDate(row.createdOn)}</TableCell>
        <TableCell align="left">{formateCurrency(row.totalAmount)}</TableCell>

        <ViewGuard
          orPermissions={[
            "purchase.invoice.update",
            "purchase.invoice.delete",
            "purchase.invoice.read",
          ]}
        >
          <TableCell align="right">
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
        <ViewGuard permission="purchase.invoice.read">
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
        <ViewGuard permission="purchase.invoice.update">
          {row?.po?.status != "invoice_generated" && (
            <MenuItem
              onClick={() => {
                onEditRow();
                handleClosePopover();
              }}
            >
              <Iconify icon="eva:edit-fill" />
              Edit
            </MenuItem>
          )}
        </ViewGuard>

        <Divider sx={{ borderStyle: "dashed" }} />
        <ViewGuard permission="purchase.invoice.update">
          <MenuItem
            onClick={() => {
              console.log(row);
              setPurchaseInvoiceObj(row);
              handlePaymentOpen();
            }}
          >
            Payment Update
          </MenuItem>
        </ViewGuard>
        <PaymentUpdateForm
          open={paymentOpen}
          invoice={purchaseInvoiceObj}
          onClose={handlePaymentClose}
        />

        <Divider sx={{ borderStyle: "dashed" }} />

        <ViewGuard permission="purchase.invoice.delete">
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
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
