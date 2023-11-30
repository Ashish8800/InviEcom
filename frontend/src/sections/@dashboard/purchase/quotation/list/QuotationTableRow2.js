import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import { TableCell, TableRow } from "@mui/material";
// utils
// components

// ----------------------------------------------------------------------

QuotationTableRow2.propTypes = {
  requestDetails: PropTypes.object,
  row: PropTypes.object,
  selected: PropTypes.bool,
};

export default function QuotationTableRow2({
  data,
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);
  const [requestDetails, setRequestDetails] = useState("");

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
        <TableCell align="left">{row?.ipn}</TableCell>
        <TableCell align="left">{row?.requestedQuantity}</TableCell>
        <TableCell align="left">{row?.partNo}</TableCell>
        <TableCell align="left">{row?.quotedQuantity}</TableCell>
        <TableCell align="left">{row?.quotedUnitPrice}</TableCell>
        <TableCell align="left">{row?.quotedLeadTime}</TableCell>
      </TableRow>
    </>
  );
}
