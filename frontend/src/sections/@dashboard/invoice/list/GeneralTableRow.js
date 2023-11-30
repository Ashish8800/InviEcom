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
} from "@mui/material";
// utils
// components
import { ViewGuard } from "src/auth/MyAuthGuard";
import TrackingUpdateForm from "src/sections/@dashboard/purchase/order/form/TrackingUpdateForm";
import ConfirmDialog from "src/components/confirm-dialog";
import Iconify from "src/components/iconify";
import MenuPopover from "src/components/menu-popover";

// ----------------------------------------------------------------------
GeneralTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function GeneralTableRow({
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
        <TableCell align="left">Ashish Singh</TableCell>
        <TableCell align="left">30/03/2023</TableCell>
        <TableCell align="left">5000</TableCell>
        <TableCell align="left">Approval</TableCell>

        <ViewGuard
          orPermissions={[
            "purchase.invoice.update",
            "purchase.invoice.delete",
            "purchase.invoice.read",
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
        <ViewGuard permission="purchase.invoice.update">
          {row?.pr?.status != "po_generated" && (
            <MenuItem
              onClick={() => {
                onEditRow();
                handleClosePopover();
              }}
            >
              <Iconify icon="eva:edit-fill" />
              view
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
            Update Status
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
            Discard
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
