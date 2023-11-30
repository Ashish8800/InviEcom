import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import { Button, TableCell, TableRow, Typography } from "@mui/material";
// utils
// components
import { useEffect } from "react";
import { ViewGuard } from "src/auth/MyAuthGuard";
import PurchaseRequest from "src/controller/purchase/PurchaseRequest.controller";
import ConfirmDialog from "src/components/confirm-dialog";

// ----------------------------------------------------------------------

PurchaseTableRow1.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function PurchaseTableRow1({
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
  const [requestDetails, setRequestDetails] = useState({});

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  console.log("row", row);

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handlePRDetails = (row) => {
    setRequestDetails(row);
  };

  useEffect(() => {
    PurchaseRequest.get(data)

      .then((res) => {
        if (res.result) {
          setRequestDetails(res.data);
          console.log(res.data, "----------------------------------");
        } else {
        }
      })
      .catch((err) => {
        // window.history.back();
      });
  }, []);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="left">{row.id}</TableCell>
        <TableCell align="left">{row.indentor ?? "-"}</TableCell>

        {/* <TableCell align="left">
          {row?.items?.map((item) => (
            <Typography>{item.ipn}, </Typography>
          ))}
        </TableCell> */}

        <TableCell align="left" direction="row">
          {row?.items?.slice(0, 2)?.map((item, index) => (
            <Typography key={index}>{item.ipn}, </Typography>
          ))}

          {row?.items?.length > 2 && "..."}


        </TableCell>
        <TableCell align="left">{row.clientName ?? "-"}</TableCell>
        <TableCell align="left">{row.projectName ?? "-"}</TableCell>

        <TableCell align="left">{row.createdByName ?? "-"}</TableCell>

        <ViewGuard
          orPermissions={[
            "purchase.rfq.update",
            "purchase.rfq.delete",
            "purchase.rfq.read",
          ]}
        >
          <TableCell align="left">
            <Button variant="contained" onClick={onViewRow}>
              Generate RFQ
            </Button>
          </TableCell>
        </ViewGuard>
      </TableRow>

      {/* <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>

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
      </MenuPopover> */}

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
