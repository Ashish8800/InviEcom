import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
// utils
// components
import { ViewGuard } from "src/auth/MyAuthGuard";
import ConfirmDialog from "../../../../components/confirm-dialog";
import Iconify from "../../../../components/iconify";
import Label from "../../../../components/label";
import MenuPopover from "../../../../components/menu-popover";

// ----------------------------------------------------------------------
WarehouseTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function WarehouseTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
  onDeleteRow,
}) {
  /**
   * 
   * "id": "WH08571",
      "name": "Warehouse a Update",
      "contact": "8931916663",
      "address": "hajratganj",
      "city": "Lucknow",
      "state": "uttar pradesh",
      "country": "india",
      "pincode": "206001",
      "status": "active",
   * 
   */
  const { name, attribute, address, status } = row;

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

        <TableCell align="left">{name}</TableCell>
        <TableCell align="left">
          <Stack direction="row" alignItems="flex-start">
            {row?.attribute?.map((attribute) => (
              <Typography>{attribute.name}, </Typography>
            ))}
          </Stack>
          {/* {row.attribute?.length > 0 ? row.attribute[0].name : `-`}, */}
        </TableCell>
        <TableCell align="left">
          <Label
            variant="soft"
            color={(status === "active" && "success") || "error"}
          >
            {status}
          </Label>
        </TableCell>

        <ViewGuard
          orPermissions={[
            "inventory.category.update",
            "inventory.category.delete",
            "inventory.category.read",
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
        {/* <ViewGuard permission="inventory.category.read">
          <MenuItem
            onClick={() => {
              onViewRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:eye-fill" />
            View
          </MenuItem>
        </ViewGuard> */}

        <ViewGuard permission="inventory.category.update">
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

        <ViewGuard permission="inventory.category.delete">
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
