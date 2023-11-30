import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import { Button, Divider, MenuItem, TableCell, TableRow } from "@mui/material";
// utils
// components
import { ViewGuard } from "src/auth/MyAuthGuard";
import TrackingUpdateForm from "src/sections/@dashboard/purchase/order/form/TrackingUpdateForm";
import ConfirmDialog from "src/components/confirm-dialog";
import Iconify from "src/components/iconify";
import MenuPopover from "src/components/menu-popover";

// ----------------------------------------------------------------------
ApprovalTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function ApprovalTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState({});
  const [trackingOpen, setTrackingOpen] = useState(false);

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

  const handleTrackingStatus = () => {
    console.log(trackingStatus);
    setTrackingOpen(true);
  };

  const handleTrackingClose = () => {
    setTrackingStatus({});
    setTrackingOpen(false);
  };
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="left">ID0022</TableCell>
        <TableCell align="left">Ajay Kumar</TableCell>
        <TableCell align="left">22/07/2023</TableCell>
        <TableCell align="left">2000</TableCell>
        <TableCell align="left">2PO123</TableCell>

        <ViewGuard
          orPermissions={[
            "purchase.invoice.update",
            "purchase.invoice.delete",
            "purchase.invoice.read",
          ]}
        >
          <TableCell align="left">
            <Button variant="contained" onClick={onViewRow}>
              Approval
            </Button>
          </TableCell>
        </ViewGuard>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <ViewGuard permission="purchase.invoice.update">
          {row?.pr?.status != "po_generated" && (
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

        <ViewGuard permission="purchase.invoice.update">
          <MenuItem
            onClick={() => {
              console.log(row);
              setTrackingStatus(row);
              handleTrackingStatus();
            }}
          >
            Tracking Update
          </MenuItem>
        </ViewGuard>
        <TrackingUpdateForm
          open={trackingOpen}
          invoice={trackingStatus}
          onClose={handleTrackingClose}
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
