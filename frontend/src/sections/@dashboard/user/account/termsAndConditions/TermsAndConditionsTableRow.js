import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
  Button,
  Divider,
  IconButton,
  Link,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
// utils
// components
import { ViewGuard } from "src/auth/MyAuthGuard";
import ConfirmDialog from "src/components/confirm-dialog";
import Iconify from "src/components/iconify";
import MenuPopover from "src/components/menu-popover";
import { convertHtmlToText, formateDate } from "src/utils";
import Label from "src/components/label";

// ----------------------------------------------------------------------
TermsAndConditionsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function TermsAndConditionsTableRow({
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
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">
          {" "}
          <Typography
            sx={{
              noWrap: "true",
              maxWidth: "sm",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline-block",
              "-webkit-line-clamp": "2",
              "-webkit-box-orient": "vertical",
              
            }}
          >
            {convertHtmlToText(row.description)}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={(row.status === "inactive" && "error") || "success"}
            sx={{ textTransform: "capitalize" }}
          >
            {row.status}
          </Label>
        </TableCell>
        <ViewGuard
          orPermissions={[
            "settings.policies.update",
            "settings.policies.delete",
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
        <ViewGuard permission="settings.termsAndConditions.update">
          <MenuItem
            onClick={() => {
              onViewRow();
              handleClosePopover();
            }}
          >
            {/* <Iconify icon="eva:edit-fill" /> */}
            View
          </MenuItem>
        </ViewGuard>

        <Divider sx={{ borderStyle: "dashed" }} />

        <ViewGuard permission="settings.policies.delete">
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
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleCloseConfirm();
              onDeleteRow();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
