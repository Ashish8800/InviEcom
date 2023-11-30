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
        <TableCell align="center">{index + 1}</TableCell>
        <TableCell align="center">
          <Stack direction="row" alignItems="center">
            <Image
              disabledEffect
              visibleByDefault
              alt={row.name}
              src={row.cover}
              sx={{ borderRadius: 1.5, width: 48, height: 48 }}
            />

            <Typography sx={{ pl: 2 }}>{row.name}</Typography>
          </Stack>
        </TableCell>
        <TableCell align="center">{row.id}</TableCell>
        <TableCell align="center">{row.quantity}</TableCell>

        <TableCell align="center">{formateCurrency(row.price)}</TableCell>

        <TableCell align="center">
          {formateCurrency(row.quantity * row.price)}
        </TableCell>
      </TableRow>
    </>
  );
}
