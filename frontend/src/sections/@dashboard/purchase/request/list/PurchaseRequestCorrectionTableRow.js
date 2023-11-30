import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
  Button,
  Divider,
  Link,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
// utils
// components
import { convertDateTimeFormat, formateCurrency, formateDate } from "src/utils";
import ConfirmDialog from "src/components/confirm-dialog";
import Iconify from "src/components/iconify";
import MenuPopover from "src/components/menu-popover";

// ----------------------------------------------------------------------

PurchaseRequestCorrectionTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function PurchaseRequestCorrectionTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
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
        <TableCell align="left">
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: "pointer" }}
          >
            {row.id}
          </Link>
        </TableCell>
        <TableCell align="left">{row.clientName ?? "-"}</TableCell>
        <TableCell align="left">{row.projectName ?? "-"}</TableCell>
        <TableCell align="left">{row.indentor ?? "-"}</TableCell>
        <TableCell align="left">
          {convertDateTimeFormat(row.deliveryDate, { withTime: false })}
        </TableCell>

        <TableCell align="left">
          {row?.items?.slice(0, 2)?.map((item) => (
            <Typography>{item.ipn}, </Typography>
          ))}

          {row?.items?.length > 2 && "..."}
        </TableCell>

        <TableCell align="center">
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => {
              onViewRow();
              handleClosePopover();
            }}
          >
            Modify
          </Button>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        {/* <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />

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
