import PropTypes from "prop-types";
// @mui
import {
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
// utils
// components
import { useState } from "react";
import { ViewGuard } from "src/auth/MyAuthGuard";
import Iconify from "src/components/iconify/Iconify";
import Label from "src/components/label";
import MenuPopover from "src/components/menu-popover/MenuPopover";
import { downloadFileFromURL } from "src/utils";

// ----------------------------------------------------------------------

const PR_STATUS = {
  generated: "Generated",
  send_to_vendor: "Send to Vendor",
  quote_receive: "Quote_Receive",
  cancel: "Cancel",
};

RFQTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  // onStatusChange: PropTypes.func,
};

export default function RFQTableRow({
  row,
  selected,
  onUpdateStatus,
  onViewRow,
  onSendPDF,
  onEditRow,
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
        <TableCell align="left"> {row.id}</TableCell>
        <TableCell align="left"> {row.prRequestId}</TableCell>
        <TableCell align="left">{row.vendorDisplayName ?? "-"}</TableCell>
        <TableCell align="left">
          {row?.items?.slice(0, 2)?.map((item) => (
            <Typography key={item.ipn}>{item.ipn}, </Typography>
          ))}

          {row?.items?.length > 2 && "..."}
        </TableCell>
        <TableCell align="left">{row.createdByName ?? "-"}</TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (row.status === "generated" && "info") ||
              (row.status === "send_to_vendor" && "warning") ||
              (row.status === "quote_receive" && "success") ||
              (row.status === "cancel" && "error") ||
              "default"
            }
          >
            {PR_STATUS[row.status] ?? "DEFAULT"}
          </Label>
        </TableCell>
        <ViewGuard
          orPermissions={[
            "purchase.rfq.update",
            "purchase.rfq.delete",
            "purchase.rfq.read",
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

        {/* <ViewGuard permission="purchase.rfq.update">
          <TableCell align="left">
            <Button variant="contained" size="small" onClick={onUpdateStatus}>
              Update Status
            </Button>
          </TableCell>
        </ViewGuard> */}
      </TableRow>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        {/* <ViewGuard permission="purchase.invoice.update">
          <MenuItem
            onClick={() => {
              onEditRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>
        </ViewGuard> */}

        <ViewGuard permission="purchase.rfq.update">
          <MenuItem onClick={onSendPDF}>
            <Iconify icon="eva:share-fill" />
            Send Email
          </MenuItem>
        </ViewGuard>
        <ViewGuard permission="purchase.rfq.read">
          <MenuItem
            onClick={function () {
              console.log(row.pdfUrl);
              downloadFileFromURL(row.pdfUrl);
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:download-fill" />
            Download PDF
          </MenuItem>
        </ViewGuard>
        <ViewGuard permission="purchase.rfq.update">
          <MenuItem onClick={onUpdateStatus}>
            {" "}
            <Iconify icon="eva:edit-fill" />
            Update Status
          </MenuItem>
        </ViewGuard>
      </MenuPopover>
    </>
  );
}
