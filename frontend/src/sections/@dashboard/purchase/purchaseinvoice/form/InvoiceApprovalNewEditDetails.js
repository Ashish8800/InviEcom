import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// form
import { useFormContext } from "react-hook-form";
import { useSettingsContext } from "src/components/settings";
// @mui
import {
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Typography,
} from "@mui/material";

import Scrollbar from "src/components/scrollbar";
// utils
// components
import { RHFTextField, RHFUpload } from "src/components/hook-form";
import Iconify from "src/components/iconify";

import { PATH_DASHBOARD } from "src/routes/paths";
// _mock_

import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from "src/components/table";
import PurchaseInvoice from "src/controller/purchase/PurchaseInvoice.controller";
import InvoiceCreateTableRow1 from "src/sections/@dashboard/purchase/purchaseinvoice/list/InvoiceCreateTableRow1";
import { formateCurrency, formateDate } from "src/utils";

const TABLE_HEAD = [
  { id: "srNo", label: " SR.No", align: "center" },
  { id: "item", label: "Item & Description", align: "left" },
  { id: "quantity", label: "Quantity", align: "left" },
  { id: "rate", label: "Rate", align: "left" },
  { id: "discount", label: "Discount", align: "left" },
  { id: "amount", label: "Amount", align: "left" },
];

// ----------------------------------------------------------------------

export default function InvoiceApprovalNewEditDetails({ id }) {
  const { control, setValue, watch, resetField } = useFormContext();

  const [open, setOpen] = useState(false);

  const [purchaseInvoice, setPurchaseInvoice] = useState({});
  const [tableAccounts, setTableAccounts] = useState({});

  const values = watch();

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("cover", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = () => {
    setValue("cover", null);
  };

  // ===================================================================================

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");
  const [warehouseOpen, setWarehouseOpen] = useState(false);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.purchase.vendor.edit(id));
  };

  useEffect(() => {
    if (id) {
      PurchaseInvoice.get(id)
        .then((res) => {
          setPurchaseInvoice(res);
          setTableData(res.pr.items ?? []);
          if (res.thumbnail) {
            setValue("cover", {
              preview: res.thumbnail,
            });
          }
          setValue("id", res.id);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    let subtotal = 0;

    tableData.forEach((item) => {
      subtotal += item.quantity * item.price;
    });
    setTableAccounts({
      subtotal: subtotal,
      discount: 0,
      tax: 0,
      total: subtotal,
    });

    setValue("totalAmount", subtotal);
  }, [tableData]);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container>
        <Grid item xs={12} md={5}>
          <Stack sx={{ p: 1 }}>
            <Stack spacing={1}>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  PI Number:
                </Typography>
                <Typography>{purchaseInvoice?.id}</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  PO Number:
                </Typography>
                <Typography>{purchaseInvoice?.po?.id}</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Client:
                </Typography>
                <Typography>{purchaseInvoice?.clientName}</Typography>
              </Stack>
              <Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Project:
                  </Typography>
                  <Typography>{purchaseInvoice?.projectName}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    PR Requested By:
                  </Typography>
                  <Typography>{purchaseInvoice?.pr?.indentor}</Typography>
                </Stack>
              </Stack>
              <Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    PR Approved By:
                  </Typography>
                  <Typography>{purchaseInvoice?.prApproverName}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    PR Approver Comment:
                  </Typography>
                  <Typography>
                    {purchaseInvoice?.pr?.prApproveComment}
                  </Typography>
                </Stack>
              </Stack>

              <Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    PO Approved By:
                  </Typography>
                  <Typography> {purchaseInvoice?.poApproverName}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    PO Approver Comment:
                  </Typography>
                  <Typography>
                    {purchaseInvoice?.po?.poApproveComment}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack sx={{ pt: 3 }} spacing={1}>
              <Typography>Bill Attached:</Typography>
              <RHFUpload
                disabled
                name="cover"
                label="Invoice Upload"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>
            <Stack sx={{ pt: 1 }}>
              <RHFTextField
                bordered="bordered"
                name="invoiceApproverComment"
                label="Comment"
                multiline
                rows={4}
              />
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ p: 1 }}>
            <Stack>
              <Grid container>
                <Grid item xs={12} md={6} sx={{ p: 2 }}>
                  <Stack>
                    <Stack>
                      <Stack direction="row">
                        <Typography
                          paragraph
                          sx={{ color: "text.disabled", pr: 1 }}
                        >
                          Vendor Name:
                        </Typography>
                        <Typography>{purchaseInvoice?.vendorName}</Typography>
                      </Stack>
                      <Stack direction="row">
                        <Typography
                          paragraph
                          sx={{ color: "text.disabled", pr: 1 }}
                        >
                          Vendor Address:
                        </Typography>
                        <Typography>
                          {`${
                            purchaseInvoice?.vendorDetails?.billing?.address ??
                            ""
                          } ${
                            purchaseInvoice?.vendorDetails?.billing?.city ?? ""
                          } ${
                            purchaseInvoice?.vendorDetails?.billing?.state ?? ""
                          } ${
                            purchaseInvoice?.vendorDetails?.billing?.country ??
                            ""
                          } ${
                            purchaseInvoice?.vendorDetails?.billing?.pincode ??
                            ""
                          } `}
                        </Typography>
                      </Stack>
                      <Stack direction="row">
                        <Typography
                          paragraph
                          sx={{ color: "text.disabled", pr: 1 }}
                        >
                          Deliver To:
                        </Typography>
                        <Typography>
                          {purchaseInvoice?.pr?.deliverTo}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6} sx={{ p: 2 }}>
                  <Stack>
                    <Stack direction="row">
                      <Typography
                        paragraph
                        sx={{ color: "text.disabled", pr: 1 }}
                      >
                        PO Number:
                      </Typography>
                      <Typography> {purchaseInvoice?.po?.id}</Typography>
                    </Stack>
                    <Stack direction="row">
                      <Typography
                        paragraph
                        sx={{ color: "text.disabled", pr: 1 }}
                      >
                        PO Date:
                      </Typography>
                      <Typography>
                        {formateDate(purchaseInvoice?.po?.createdOn, {
                          withTime: false,
                        })}
                      </Typography>
                    </Stack>
                    <Stack direction="row">
                      <Typography
                        paragraph
                        sx={{ color: "text.disabled", pr: 1 }}
                      >
                        Expected Delivery Date:
                      </Typography>
                      <Typography>
                        {formateDate(purchaseInvoice?.pr?.deliveryDate, {
                          withTime: false,
                        })}
                      </Typography>
                    </Stack>
                    <Stack direction="row">
                      <Typography
                        paragraph
                        sx={{ color: "text.disabled", pr: 1 }}
                      >
                        Ref:
                      </Typography>
                      <Typography>-</Typography>
                    </Stack>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={12}>
                  <Divider />

                  <TableContainer
                    sx={{ position: "relative", overflow: "unset" }}
                  >
                    <TableSelectedAction
                      dense={dense}
                      numSelected={selected.length}
                      rowCount={tableData.length}
                      onSelectAllRows={(checked) =>
                        onSelectAllRows(
                          checked,
                          tableData.map((row) => row.id)
                        )
                      }
                      action={
                        <Tooltip title="Delete">
                          <IconButton
                            color="primary"
                            onClick={handleOpenConfirm}
                          >
                            <Iconify icon="eva:trash-2-outline" />
                          </IconButton>
                        </Tooltip>
                      }
                    />

                    <Scrollbar>
                      <Table
                        size={dense ? "small" : "medium"}
                        sx={{ minWidth: 800 }}
                      >
                        <TableHeadCustom
                          order={order}
                          orderBy={orderBy}
                          headLabel={TABLE_HEAD}
                          rowCount={tableData.length}
                          numSelected={selected.length}
                          onSort={onSort}
                        />

                        <TableBody>
                          {tableData.map((row, index) => {
                            return (
                              <InvoiceCreateTableRow1
                                key={`${row.toString()}_${index}`}
                                row={row}
                                index={index}
                                selected={selected.includes(row.id)}
                                onSelectRow={() => onSelectRow(row.id)}
                                onDeleteRow={() => handleDeleteRow(row.id)}
                                onEditRow={() => handleEditRow(row.name)}
                              />
                            );
                          })}

                          <TableEmptyRows
                            height={denseHeight}
                            emptyRows={emptyRows(
                              page,
                              rowsPerPage,
                              tableData.length
                            )}
                          />

                          <TableNoData isNotFound={isNotFound} />
                        </TableBody>
                      </Table>
                    </Scrollbar>
                  </TableContainer>
                  <Divider />

                  <Stack
                    display="flex"
                    justifyContent="end"
                    direction="column"
                    sx={{ mt: 2, float: "right" }}
                    spacing={1}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={3}
                    >
                      <Typography sx={{ minWidth: "130px" }}>
                        Sub Total
                      </Typography>
                      <Typography>
                        {formateCurrency(tableAccounts.subtotal)}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={3}
                    >
                      <Typography sx={{ minWidth: "130px" }}>
                        Discount
                      </Typography>
                      <Typography>
                        {formateCurrency(tableAccounts.discount)}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={3}
                    >
                      <Typography variant="h5" sx={{ minWidth: "130px" }}>
                        Total
                      </Typography>
                      <Typography variant="h5">
                        {formateCurrency(tableAccounts.total)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// =============================================================================

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== "all") {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== "all") {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
