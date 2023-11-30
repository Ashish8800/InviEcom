import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import { Button, TableCell, TableRow } from "@mui/material";
// utils
// components
import { ViewGuard } from "src/auth/MyAuthGuard";
import ConfirmDialog from "../../../../components/confirm-dialog";

// ----------------------------------------------------------------------
StockTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function StockTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
  onDeleteRow,
}) {
  const { ipn, warehouse, updatedOn, stock } = row;

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
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell align="left">{warehouse}</TableCell>
        <TableCell align="left">{ipn}</TableCell>
        <TableCell align="left">{stock}</TableCell>
        <TableCell align="left">{updatedOn}</TableCell>

        {/* <TableCell align="left">
          <Label
            variant="soft"
            color={
              (status === "active" && "success") ||
              (status === "inactive" && "warning") ||
              (status === "inactive" && "error") ||
              "default"
            }
          >
            {status}
          </Label>
        </TableCell> */}

        <ViewGuard
          orPermissions={[
            "inventory.warehouse.update",
            "inventory.warehouse.delete",
            "inventory.warehouse.read",
          ]}
        >
          <TableCell align="left">
            <Button variant="contained" onClick={onViewRow}>
              History
            </Button>
          </TableCell>
        </ViewGuard>
      </TableRow>

      {/* <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <ViewGuard permission="inventory.warehouse.read">
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

        <ViewGuard permission="inventory.warehouse.update">
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

        <ViewGuard permission="inventory.warehouse.delete">
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
      </MenuPopover> */}

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
