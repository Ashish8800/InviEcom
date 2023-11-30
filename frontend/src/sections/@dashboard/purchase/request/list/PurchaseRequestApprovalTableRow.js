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
import { fCurrency } from "src/utils/formatNumber";
// components
import { convertDateTimeFormat, formateDate } from "src/utils";
import ConfirmDialog from "src/components/confirm-dialog";
import Iconify from "src/components/iconify";
import MenuPopover from "src/components/menu-popover";
import { ViewGuard } from "src/auth/MyAuthGuard";

// ----------------------------------------------------------------------

PurchaseRequestApprovalTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function PurchaseRequestApprovalTableRow({
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
        {/* <TableCell align="left">
          {row.ipn ?? "-"}
        </TableCell> */}

        <TableCell align="left">
          {row?.items?.slice(0, 2)?.map((item) => (
            <Typography>{item.ipn}, </Typography>
          ))}

          {row?.items?.length > 2 && "..."}
        </TableCell>
        <TableCell
          align="left"
          sx={{ textTransform: "capitalize" }}
        ></TableCell>
        <ViewGuard
          orPermissions={[
            "purchase.purchase_request.update",
            "purchase.purchase_request.delete",
            "purchase.purchase_request.read",
          ]}
        >
          <TableCell align="center">
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => {
                onViewRow();
                handleClosePopover();
              }}
            >
              {/* <Iconify icon="eva:eye-fill" /> */}
              Approve
            </Button>
          </TableCell>
        </ViewGuard>
      </TableRow>
    </>
  );
}
