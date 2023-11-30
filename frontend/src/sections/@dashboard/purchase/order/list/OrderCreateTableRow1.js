import PropTypes from "prop-types";
// @mui
import { TableCell, TableRow } from "@mui/material";

// utils
import { RHFRadioGroup } from "src/components/hook-form";

// ----------------------------------------------------------------------
OrderTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  index: PropTypes.string,
};

export default function OrderTableRow({ row, selected, index }) {
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">
          <RHFRadioGroup></RHFRadioGroup>
        </TableCell>
        <TableCell align="left">PCB Board</TableCell>
        <TableCell align="left">100</TableCell>

        <TableCell align="left">1000</TableCell>

        <TableCell align="left">10%</TableCell>

        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          1000
        </TableCell>
      </TableRow>
    </>
  );
}
