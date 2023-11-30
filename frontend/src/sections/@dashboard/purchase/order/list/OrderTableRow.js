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
import ConfirmDialog from "../../../../../components/confirm-dialog";
import Iconify from "../../../../../components/iconify";
import MenuPopover from "../../../../../components/menu-popover";

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
        <TableCell align="left">PO00022</TableCell>

        <TableCell align="left">RFQ99999</TableCell>
        <TableCell align="left">PR002345</TableCell>
        <TableCell align="left">QUO45567</TableCell>
        <TableCell align="left">22/07/2023</TableCell>
        <TableCell align="left">IPN00022333</TableCell>
        <TableCell align="left">4000</TableCell>
        <TableCell align="left">Muskan</TableCell>
        <TableCell align="left">25/07/2023</TableCell>

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

        <ViewGuard permission="purchase.purchase_order.delete">
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
