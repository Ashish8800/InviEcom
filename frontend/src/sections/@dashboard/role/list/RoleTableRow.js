import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
// components
import Label from "../../../../components/label";
import Iconify from "../../../../components/iconify";
import MenuPopover from "../../../../components/menu-popover";
import ConfirmDialog from "../../../../components/confirm-dialog";
import { ViewGuard } from "src/auth/MyAuthGuard";

// ----------------------------------------------------------------------

RoleTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function RoleTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { name, avatarUrl, company, role, isVerified, status } = row;

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
        <TableCell align="left">{row.id}</TableCell>
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">{row.description}</TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={(status === "banned" && "error") || "success"}
            sx={{ textTransform: "capitalize" }}
          >
            {status}
          </Label>
        </TableCell>

        <ViewGuard
          orPermissions={[
            "users_and_roles.roles.update",
            "users_and_roles.roles.delete",
            "users_and_roles.roles.read",
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
        sx={{ width: 140 }}
      >
        <ViewGuard permission="users_and_roles.roles.read">
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
        <ViewGuard permission="users_and_roles.roles.update">
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

        <ViewGuard permission="users_and_roles.roles.delete">
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
