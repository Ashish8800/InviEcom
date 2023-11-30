import { useCallback, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
// form
import { useSettingsContext } from "src/components/settings";
// @mui
import {
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

import { useForm } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import Scrollbar from "src/components/scrollbar";
// utils
import { fData } from "../../../../utils/formatNumber";
// components
import Iconify from "src/components/iconify";
import { RHFSwitch, RHFUploadAvatar } from "../../../../components/hook-form";

import { PATH_DASHBOARD } from "src/routes/paths";

// _mock_
import PropTypes from "prop-types";

import FormProvider from "src/components/hook-form/FormProvider";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from "src/components/table";
import CustomerOrder from "src/controller/customer/CustomerOrder.controller";
import apiUrls from "src/routes/apiUrls";
import CustomerTableRow1 from "src/sections/@dashboard/salescustomer/list/CustomerTableRow1.js";
import { Api, formateDate } from "src/utils";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "orderID", label: " Order ID", align: "left" },
  { id: "date", label: " Order Date", align: "left" },
  { id: "product", label: "Products", align: "left" },
  { id: "orderAmount", label: "Total Order Amount", align: "left" },
  { id: "paymentStatus", label: "Payment Status", align: "left" },
  { id: "transactionId", label: "Transaction ID", align: "left" },
  { id: "deliveryStatus", label: "Delivery Status", align: "left" },
];

// ----------------------------------------------------------------------
CustomerNewEditDetails.propTypes = {
  billing: PropTypes.object,
  onBackStep: PropTypes.func,
};

export default function CustomerNewEditDetails() {
  const { id } = useParams();

  const defaultValues = {
    shipping: {
      address: "",
      city: "",
      state: "",
      country: "",
    },
    status: false,
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [deliveryFormData, setDeliveryFormData] = useState();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isEditBillingAddress, setIsEditBillingAddress] = useState(false);

  const navigate = useNavigate();

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

  const handleSaveBillingAddress = () => {
    setIsEditBillingAddress(true);

    setValue("shipping.address", customerList?.shipping?.address);
    setValue("shipping.city", customerList?.shipping?.city);
    setValue("shipping.state", customerList?.shipping?.state);
    setValue("shipping.country", customerList?.shipping?.country);
  };

  const onSubmit = async (data) => {
    data.status = data.status ? "active" : "inactive";

    Api.put(apiUrls.customer.update(id), data)
      .then((res) => {
        if (res.result) {
          window.Toast("Your profile updated successfully");
          setIsEditBillingAddress(false);

          Api.get(apiUrls.customer.get(id)).then((res) => {
            setCustomerList(res.data);
          });
        } else {
          window.ToastError(res.message);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    Api.get(apiUrls.customer.get(id)).then((res) => {
      setCustomerList(res.data);
      setValue("shipping.address", res.data?.shipping?.address);
      setValue("shipping.city", res.data?.shipping?.city);
      setValue("shipping.state", res.data?.shipping?.state);
      setValue("shipping.country", res.data?.shipping?.country);

      setValue("status", res.data.status == "active" ? true : false);
      setValue("photoURL", res.data?.thumbnail);
    });
  }, []);

  useEffect(() => {
    CustomerOrder.list(`?customerId=${id}`)
      .then((res) => {
        setTableData(res);
        console.log(res, "-----------------------------------");
      })
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 2 }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Stack sx={{ pt: 4, px: 3 }}>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Customer ID:
                </Typography>
                <Typography>{customerList?.id}</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Customer Name:
                </Typography>
                <Typography>
                  {customerList?.firstName} {customerList?.lastName}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Date:
                </Typography>
                <Typography>{formateDate(customerList?.createdOn)}</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Contact Number:
                </Typography>
                <Typography>{customerList?.mobile}</Typography>
              </Stack>

              <Stack>
                <Stack sx={{ pb: 2, pt: 2 }}>
                  <Typography variant="h6">Billing Address</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Address:
                  </Typography>
                  <Typography>{customerList?.billing?.address}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    City:
                  </Typography>
                  <Typography>{customerList?.billing?.city}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    State:
                  </Typography>
                  <Typography>{customerList?.billing?.state}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Country:
                  </Typography>
                  <Typography>{customerList?.billing?.country}</Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack
              display="flex"
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ ml: 1 }}
            >
              <RHFSwitch name="status" labelPlacement="start" label="Access" />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack sx={{ p: 1 }} spacing={1}>
              <RHFUploadAvatar
                disabled="true"
                name="photoURL"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />

              <Stack>
                <Stack sx={{ pb: 2 }}>
                  <Typography variant="h6">Delivery Address</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Address:
                  </Typography>
                  <Typography>{customerList?.shipping?.address}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    City:
                  </Typography>
                  <Typography>{customerList?.shipping?.city}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    State:
                  </Typography>
                  <Typography>{customerList?.shipping?.state}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Country:
                  </Typography>
                  <Typography>{customerList?.shipping?.country}</Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              display="flex"
              justifyContent="end"
              sx={{ pr: 2 }}
              spacing={1}
            >
              <LoadingButton
                variant="contained"
                size="medium"
                loading={isSubmitting}
                type="submit"
              >
                Save
              </LoadingButton>
              <LoadingButton
                color="error"
                variant="contained"
                size="medium"
                type="button"
                onClick={() => {
                  setIsEditBillingAddress(false);
                  navigate(PATH_DASHBOARD.sales.customer.root);
                }}
              >
                cancel
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ mt: 3 }}>
        <Stack>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Stack sx={{ p: 2 }}>
                <Typography variant="h6">Orders</Typography>
              </Stack>
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
                    />

                    <TableBody>
                      {dataFiltered
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => (
                          <CustomerTableRow1
                            key={row.id}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            // onEditRow={() => handleEditRow(row.name)}
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

              <TablePaginationCustom
                count={dataFiltered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                //
                dense={dense}
                onChangeDense={onChangeDense}
              />
              <Divider />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </FormProvider>
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
