import sum from "lodash/sum";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// form
import { useFieldArray, useFormContext } from "react-hook-form";
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
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import Scrollbar from "src/components/scrollbar";
// utils
// components
import Iconify from "src/components/iconify";
import { RHFSelect } from "../../../../../components/hook-form";

import { PATH_DASHBOARD } from "src/routes/paths";
// _mock_
import { _userList } from "src/_mock/arrays";

import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from "src/components/table";
import OrderCretaeTableRow1 from "src/sections/@dashboard/purchase/order/list/OrderCreateTableRow1";

// ----------------------------------------------------------------------
const StyledRowResult = styled(TableRow)(({ theme }) => ({
  "& td": {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));
const SERVICE_OPTIONS = [
  { id: 1, name: "full stack development", price: 90.99 },
  { id: 2, name: "backend development", price: 80.99 },
  { id: 3, name: "ui design", price: 70.99 },
  { id: 4, name: "ui/ux design", price: 60.99 },
  { id: 5, name: "front end development", price: 40.99 },
];
const PAYMENT_MODE = ["gapy", "credit card", "debit card"];
const Vendor = ["RIYA", "SHREYA", "DIVYA"];
const PURCHASE_NUMBER = ["100234", "00983", "007654"];

const PR_OPTIONS = ["user list", "role list"];

const TABLE_HEAD = [
  { id: "srNo", label: " SR.No", align: "center" },
  { id: "item", label: "Item & Description", align: "left" },
  { id: "quantity", label: "Quantity", align: "left" },
  { id: "rate", label: "Rate", align: "left" },
  { id: "discount", label: "Discount", align: "left" },
  { id: "amount", label: "Amount", align: "left" },
  // { id: "status", label: "Status", align: "center" },
  // { id: "action", label: "Action", align: "center" },
  // { id: "" },
];

// ----------------------------------------------------------------------

export default function ReceiveNewEditDetails() {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [categoryOpen, setCategoryOpen] = useState(false);

  const handleCategoryOpen = () => {
    setCategoryOpen(true);
  };

  const handleCategoryClose = () => {
    setCategoryOpen(false);
  };

  const [subCategoryOpen, setSubCategoryOpen] = useState(false);

  const handleSubCategoryOpen = () => {
    setSubCategoryOpen(true);
  };

  const handleSubCategoryClose = () => {
    setSubCategoryOpen(false);
  };
  const [manufacturerOpen, setManufacturerOpen] = useState(false);

  const handleManufacturerOpen = () => {
    setManufacturerOpen(true);
  };

  const handleManufacturerClose = () => {
    setManufacturerOpen(false);
  };

  const values = watch();

  const totalOnRow = values.items.map((item) => item.quantity * item.price);

  const totalPrice = sum(totalOnRow) - values.discount + values.taxes;

  useEffect(() => {
    setValue("totalPrice", totalPrice);
  }, [setValue, totalPrice]);

  const handleAdd = () => {
    append({
      title: "",
      description: "",
      service: "",
      quantity: 1,
      price: 0,
      total: 0,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index) => {
      resetField(`items[${index}].quantity`);
      resetField(`items[${index}].price`);
      resetField(`items[${index}].total`);
    },
    [resetField]
  );

  const handleSelectService = useCallback(
    (index, option) => {
      setValue(
        `items[${index}].price`,
        SERVICE_OPTIONS.find((service) => service.name === option)?.price
      );
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

  const handleChangeQuantity = useCallback(
    (event, index) => {
      setValue(`items[${index}].quantity`, Number(event.target.value));
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

  const handleChangePrice = useCallback(
    (event, index) => {
      setValue(`items[${index}].price`, Number(event.target.value));
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

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
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState(_userList);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");
  const [warehouseOpen, setWarehouseOpen] = useState(false);

  const handleWarehouseOpen = () => {
    setWarehouseOpen(true);
  };
  const handleWarehouseClose = () => {
    setWarehouseOpen(false);
  };

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

  const isFiltered =
    filterName !== "" || filterRole !== "all" || filterStatus !== "all";

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
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

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter(
      (row) => !selectedRows.includes(row.id)
    );
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage =
          Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id) => {
    console.log("handleEditRow", id);
    navigate(PATH_DASHBOARD.purchase.vendor.edit(id));
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Stack sx={{ pt: 4, px: 3 }} spacing={2}>
            <RHFSelect small name="purchaseRequest" label="Purchase Request*">
              {PURCHASE_NUMBER.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect small name="Vendor" label="Vendor">
              {Vendor.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6} sx={{ pt: 4, px: 3 }}>
          <Stack spacing={2} sx={{ p: 3 }} textAlign="right">
            <Typography>Client Name: Inevitable Infotech</Typography>
            <Typography>Project Name: Bill Board</Typography>
            <Typography>Requested By: Prabhakar (12 May23)</Typography>
            <Typography>Approved By: Madhukar(15 May23)</Typography>
            <Typography>Approver Comment: Good To Go For it</Typography>
          </Stack>
        </Grid>
      </Grid>

      <Card sx={{ p: 3 }}>
        <Stack>
          <Grid container>
            <Grid item xs={12} md={6} sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Typography>Vendor Name: Abhaas</Typography>
                <Typography>Vendor Address: </Typography>
                <Typography> Chennai ,765434 Tamil Nadu</Typography>
                <Typography>Deliever To:</Typography>
                <Typography>Karnataka India</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ p: 2 }}>
              <Stack spacing={2} textAlign="right">
                <Typography>Purchase Order: 000987</Typography>

                <Typography>PO Date: 18/04/2023</Typography>
                <Typography>Expected Delivery Date: 18/05/2023</Typography>
                <Typography>Ref: PO Number</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={12}>
              <Divider />

              <TableContainer sx={{ position: "relative", overflow: "unset" }}>
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
                      <IconButton color="primary" onClick={handleOpenConfirm}>
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
                      onSelectAllRows={false}
                    />

                    <TableBody>
                      {dataFiltered
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => (
                          <OrderCretaeTableRow1
                            key={row.id}
                            row={row}
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
                      <StyledRowResult>
                        <TableCell colSpan={3} />

                        <TableCell align="right" sx={{ typography: "body1" }}>
                          <Box sx={{ mt: 2 }} />
                          Subtotal
                        </TableCell>

                        <TableCell
                          align="right"
                          width={120}
                          sx={{ typography: "body1" }}
                        >
                          <Box sx={{ mt: 2 }} />
                          100
                        </TableCell>
                      </StyledRowResult>

                      <StyledRowResult>
                        <TableCell colSpan={3} />

                        <TableCell align="right" sx={{ typography: "body1" }}>
                          Discount
                        </TableCell>

                        <TableCell
                          align="right"
                          width={120}
                          sx={{ color: "error.main", typography: "body1" }}
                        >
                          100
                        </TableCell>
                      </StyledRowResult>

                      <StyledRowResult>
                        <TableCell colSpan={3} />

                        <TableCell align="right" sx={{ typography: "body1" }}>
                          Taxes
                        </TableCell>

                        <TableCell
                          align="right"
                          width={120}
                          sx={{ typography: "body1" }}
                        >
                          1000
                        </TableCell>
                      </StyledRowResult>

                      <StyledRowResult>
                        <TableCell colSpan={3} />

                        <TableCell align="right" sx={{ typography: "h6" }}>
                          Total
                        </TableCell>

                        <TableCell
                          align="right"
                          width={140}
                          sx={{ typography: "h6" }}
                        >
                          2000
                        </TableCell>
                      </StyledRowResult>
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
              <Divider />
            </Grid>
          </Grid>
        </Stack>
      </Card>
      <Grid item xs={12} md={12}>
        <Stack spacing={1} sx={{ pb: 3, p: 2 }}>
          <Box
            rowGap={1}
            columnGap={1}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFSelect
              fullWidth
              name="purchaseRequest"
              label="PR Approver"
              // InputLabelProps={{ shrink: true }}
            >
              {PR_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          </Box>
        </Stack>
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
