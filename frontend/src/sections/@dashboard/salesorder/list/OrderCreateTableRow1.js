import PropTypes from "prop-types";
// @mui
import { Link, Stack, TableRow, TableCell, Typography } from "@mui/material";
// utils
// components
import Image from "../../../../components/image";
import { formateCurrency } from "src/utils";

// ----------------------------------------------------------------------
OrderCreateTableRow1.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
};

export default function OrderCreateTableRow1({ row, index }) {
  return (
    <>
      <TableRow hover>
        <TableCell align="left">
          
          {row.name}
        </TableCell>
        <TableCell align="left">{row.id}</TableCell>
        <TableCell align="left">{row.quantity}</TableCell>

        <TableCell align="center">{formateCurrency(row.price)}</TableCell>

        <TableCell align="center">
          {formateCurrency(row.quantity * row.price)}
        </TableCell>
      </TableRow>
    </>
  );
}
