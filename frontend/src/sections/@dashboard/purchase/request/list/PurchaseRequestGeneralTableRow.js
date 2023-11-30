import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
// utils
// components
import { ViewGuard } from "src/auth/MyAuthGuard";
import { convertDateTimeFormat } from "src/utils";
import ConfirmDialog from "src/components/confirm-dialog";
import Iconify from "src/components/iconify";
import Label from "src/components/label";
import MenuPopover from "src/components/menu-popover";

// ----------------------------------------------------------------------

const PR_STATUS = {
  pending: "In Approval",
  approved: "Approved",
  rejected: "Rejected",
  correction: "Under Correction",
  po_generated: "PO Generated",
  rfq_generated: "RFQ Generated",
  withdrawal: "Withdrawal",
};

PurchaseRequestGeneralTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function PurchaseRequestGeneralTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onDeleteRow,
}) {
  const { status } = row;

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
        <TableCell align="left"> {row.id}</TableCell>
        <TableCell align="left">{row.clientName ?? "-"}</TableCell>
        <TableCell align="left">{row.projectName ?? "-"}</TableCell>
        <TableCell align="left">{row.indentor ?? "-"}</TableCell>

        <TableCell align="left">
          {convertDateTimeFormat(row.deliveryDate)}
        </TableCell>

        <TableCell align="left">
          {row?.items?.slice(0, 2)?.map((item) => (
            <Typography>{item.ipn}, </Typography>
          ))}

          {row?.items?.length > 2 && "..."}
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (status === "pr_generated" && "success") ||
              (status === "approved" && "success") ||
              (status === "pending" && "warning") ||
              (status === "correction" && "info") ||
              (status === "rejected" && "error") ||
              (status === "withdrawal" && "error") ||
              "default"
            }
          >
            {PR_STATUS[row.status] ?? "DEFAULT"}
          </Label>
        </TableCell>

        <ViewGuard
          orPermissions={[
            "purchase.purchase_request.update",
            "purchase.purchase_request.delete",
            "purchase.purchase_request.read",
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
        <ViewGuard permission="purchase.purchase_request.read">
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
        <ViewGuard permission="purchase.purchase_request.update">
          {row.status == "pending" && (
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

        <ViewGuard permission="purchase.purchase_request.delete">
          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="eva:trash-2-outline" />
            Withdraw
          </MenuItem>
        </ViewGuard>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Withdraw"
        content="Are you sure want to Withdraw?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              handleCloseConfirm();
            }}
          >
            Withdraw
          </Button>
        }
      />
    </>
  );
}
