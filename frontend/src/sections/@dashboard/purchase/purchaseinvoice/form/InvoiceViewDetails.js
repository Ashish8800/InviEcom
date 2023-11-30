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
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Typography,
} from "@mui/material";

import Scrollbar from "src/components/scrollbar";
// utils
import { fCurrency } from "src/utils/formatNumber";
// components
import Iconify from "src/components/iconify";
import {
  RHFSelect,
  RHFTextField,
  RHFUpload,
} from "src/components/hook-form";

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
import PurchaseOrder from "src/controller/purchase/PurchaseOrder.controller";
import User from "src/controller/userManagement/User.controller";
import InvoiceCreateTableRow1 from "src/sections/@dashboard/purchase/purchaseinvoice/list/InvoiceCreateTableRow1";
import { formateDate } from "src/utils";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "srNo", label: " SR.No", align: "center" },
  { id: "item", label: "Item & Description", align: "left" },
  { id: "quantity", label: "Quantity", align: "left" },
  { id: "rate", label: "Rate", align: "left" },
  { id: "discount", label: "Discount", align: "left" },
  { id: "amount", label: "Amount", align: "left" },
];

// ----------------------------------------------------------------------

export default function InvoiceViewDetails({ pi }) {
  const { setValue, watch } = useFormContext();

  const [purchaseOrderList, setPurchaseOrderList] = useState([]);
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [invoiceApproverList, setInvoiceApproverList] = useState([]);

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
  const [tableAccounts, setTableAccounts] = useState({});

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
    navigate(PATH_DASHBOARD.purchase.venderedit(id));
  };

  useEffect(() => {
    PurchaseOrder.list("?status=approved")
      .then((res) => {
        setPurchaseOrderList(res);
        console.log(res);
        if (values.purchaseOrderId) {
          res.forEach((item) => {
            if (item.id == values.purchaseOrderId) {
              setPurchaseOrder(item);
              setTableData(item?.pr?.items);
            }
          });
        }
      })
      .catch((err) => console.log(err));

    User.list().then((res) => setInvoiceApproverList(res));
  }, []);

  useEffect(() => {
    if (purchaseOrderList.length > 0) {
      purchaseOrderList.forEach((item) => {
        if (item.id == values.purchaseOrderId) {
          setPurchaseOrder(item);
          setTableData(item?.pr?.items);
        }
      });
    }
  }, [values.purchaseOrderId]);

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

  useEffect(() => {
    setTableData(pi?.pr?.items ?? []);
  }, [pi]);
  console.log(pi);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container>
        <Grid item xs={12} md={4}>
          <Stack spacing={2} sx={{ p: 1 }}>
            <RHFTextField
              disabled="true"
              name="purchaseOrderId"
              label="PO Number"
            >
              {" "}
              {pi?.po?.id}
            </RHFTextField>
            <Stack spacing={1}>
              <RHFUpload
                disabled="true"
                name="cover"
                label="Invoice Upload"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>

            <RHFTextField
              disabled="true"
              name="comment"
              label="Comment"
              multiline
              rows={3}
            />

            <RHFSelect
              disabled="true"
              small="small"
              name="invoiceApprover"
              label="Invoice Approver"
            >
              {invoiceApproverList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
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
                        <Typography>
                          {pi?.vendorDetails?.vendorDisplayName}
                        </Typography>
                      </Stack>
                      <Stack direction="row">
                        <Typography
                          paragraph
                          sx={{ color: "text.disabled", pr: 1 }}
                        >
                          Vendor Address:
                        </Typography>
                        <Typography>{`${
                          pi?.vendorDetails?.billing?.address ?? ""
                        } ${pi?.vendorDetails?.billing?.city ?? ""} ${
                          pi?.vendorDetails?.billing?.state ?? ""
                        } ${pi?.vendorDetails?.billing?.country ?? ""} ${
                          pi?.vendorDetails?.billing?.pincode ?? ""
                        } `}</Typography>
                      </Stack>
                      <Stack direction="row">
                        <Typography
                          paragraph
                          sx={{ color: "text.disabled", pr: 1 }}
                        >
                          Deliver To:
                        </Typography>
                        <Typography> {pi?.pr?.deliverTo}</Typography>
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
                        Purchase Order:
                      </Typography>
                      <Typography> {pi?.po?.id}</Typography>
                    </Stack>
                    <Stack direction="row">
                      <Typography
                        paragraph
                        sx={{ color: "text.disabled", pr: 1 }}
                      >
                        PO Date:
                      </Typography>
                      <Typography>
                        {formateDate(pi?.po?.createdOn, {
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
                        {formateDate(pi?.pr?.deliveryDate, {
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
                          {tableData.map((row, index) => (
                            <InvoiceCreateTableRow1
                              key={`${row.id}_${index}`}
                              row={row}
                              index={index}
                              selected={selected.includes(row.id)}
                              onSelectRow={() => onSelectRow(row.id)}
                              onDeleteRow={() => handleDeleteRow(row.id)}
                              onEditRow={() => handleEditRow(row.name)}
                            />
                          ))}

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
                        {fCurrency(tableAccounts.subtotal).replace("$", "₹ ") ==
                        ""
                          ? "₹ 0"
                          : fCurrency(tableAccounts.subtotal).replace(
                              "$",
                              "₹ "
                            )}
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
                        {fCurrency(tableAccounts.discount).replace("$", "₹ ") ==
                        ""
                          ? "₹ 0"
                          : fCurrency(tableAccounts.discount).replace(
                              "$",
                              "₹ "
                            )}
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
                        {fCurrency(tableAccounts.total).replace("$", "₹ ") == ""
                          ? "₹ 0"
                          : fCurrency(tableAccounts.total).replace("$", "₹ ")}
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
