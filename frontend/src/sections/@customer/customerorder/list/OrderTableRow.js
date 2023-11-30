import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
  Link,
  Divider,
  TableRow,
  Typography,
  Button,
  MenuItem,
  TableCell,
} from "@mui/material";
// utils
import { fDateTime } from "../../../../utils/formatTime";
// components
import Label from "../../../../components/label";
import Iconify from "../../../../components/iconify";
import MenuPopover from "../../../../components/menu-popover";
import ConfirmDialog from "../../../../components/confirm-dialog";
import { formateCurrency, formateDate } from "src/utils";

// ----------------------------------------------------------------------
OrderTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function OrderTableRow({ row, selected, onViewRow }) {
  const { id, products, status, payment, createdOn, total } = row;

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
            {id}
          </Link>
        </TableCell>
        <TableCell align="left">
          <Typography>{formateDate(createdOn)}</Typography>
        </TableCell>
        <TableCell align="left">
          {products?.map((item) => `${item.name}, `)}
        </TableCell>

        <TableCell align="left">{formateCurrency(total)}</TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (row?.paymentStatus === "paid" && "success") ||
              (row?.paymentStatus === "unpaid" && "warning") ||
              (row?.paymentStatus === "overdue" && "error") ||
              "default"
            }
          >
            {row?.paymentStatus ?? "default"}
          </Label>
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (status === "delivered" && "success") ||
              (status === "shipped" && "warning") ||
              (status === "packed" && "warning") ||
              (status === "placed" && "warning") ||
              (status === "canceled" && "error") ||
              "default"
            }
          >
            {status}
          </Label>
        </TableCell>
      </TableRow>
    </>
  );
}
