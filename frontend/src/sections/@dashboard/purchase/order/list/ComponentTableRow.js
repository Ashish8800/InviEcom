import PropTypes from "prop-types";
// @mui
import { TableCell, TableRow } from "@mui/material";

// utils
import { RHFRadioGroup } from "src/components/hook-form";

// ----------------------------------------------------------------------
ComponentTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  index: PropTypes.string,
};

export default function ComponentTableRow({ row, selected, index }) {
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">
          <RHFRadioGroup></RHFRadioGroup>
        </TableCell>
        <TableCell align="left">IPN00012345</TableCell>
        <TableCell align="left">PCB Board</TableCell>
        <TableCell align="left">10</TableCell>
        <TableCell align="left">1000</TableCell>
        <TableCell align="left">10%</TableCell>
        <TableCell align="left">1000</TableCell>

        {/* <TableCell align="left">
          {fCurrency(row.price).replace("$", "₹ ")}
        </TableCell> */}

        {/* <TableCell align="left">-</TableCell> */}

        {/* <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {fCurrency(row.total).replace("$", "₹ ")}
        </TableCell> */}
      </TableRow>
    </>
  );
}
