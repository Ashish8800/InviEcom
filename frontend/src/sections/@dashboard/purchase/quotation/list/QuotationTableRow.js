import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
  Button,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
// utils
// components

import { ViewGuard } from "src/auth/MyAuthGuard";
import Iconify from "src/components/iconify";
import MenuPopover from "src/components/menu-popover/MenuPopover";
import { convertDateTimeFormat, formateDate } from "src/utils";
import ConfirmDialog from "src/components/confirm-dialog";

// ----------------------------------------------------------------------


PurchaseTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onStatusChange: PropTypes.func,
};

export default function PurchaseTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onDeleteRow,
  onUpdateStatus,
}) {
  const { status } = row;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [updateDialogData, setUpdateDialogData] = useState({});

  const [openPopover, setOpenPopover] = useState(null);
  const [clientOpen, setClientOpen] = useState(false);
  const [clientFormData, setClientFormData] = useState("");

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
        <TableCell align="left"> {row.rfqId}</TableCell>
        <TableCell align="left">
          {row.vendor?.vendorDisplayName ?? "-"}
        </TableCell>
        <TableCell align="left">
          {row?.items?.slice(0, 2)?.map((item) => (
            <Typography>{item.ipn}, </Typography>
          ))}

          {row?.items?.length > 2 && "..."}
        </TableCell>
        <TableCell align="left">
        {convertDateTimeFormat(row.quotationDate) ?? "-"}
        </TableCell>
        <TableCell align="left">{row.createdByName ?? "-"}</TableCell>
        <TableCell align="left"> {convertDateTimeFormat(row.createdOn) ?? "-"}</TableCell>

        <ViewGuard
          orPermissions={[
            "purchase.quotation.update",
            "purchase.quotation.delete",
            "purchase.quotation.read",
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
        <ViewGuard permission="purchase.quotation.read">
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

        <ViewGuard permission="purchase.quotation.update">
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

        <ViewGuard permission="purchase.quotation.delete">
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
        title="Withdraw"
        content="Are you sure want to Withdraw?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Dalate
          </Button>
        }
      />
    </>
  );
}
