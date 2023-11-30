import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// form
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { countries } from "src/assets/data";

// @mui
import {
  Box,
  Stack,
  Grid,
  Card,
  Divider,
  Typography,
  Table,
  MenuItem,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  CardHeader,
  Button,
  CardContent,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";

import Scrollbar from "src/components/scrollbar";
// utils
// components
import { RHFTextField, RHFSelect } from "../../../../components/hook-form";

import { PATH_CUSTOMER, PATH_DASHBOARD } from "src/routes/paths";
// _mock_
import { _userList } from "src/_mock/arrays";
import { styled } from "@mui/material/styles";

import { useTable, TableNoData, TableHeadCustom } from "src/components/table";
import OrderCreateTableRow1 from "src/sections/@dashboard/salesorder/list/OrderCreateTableRow1";
import { Api, formateCurrency, formateDate } from "src/utils";
import apiUrls from "src/routes/apiUrls";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Iconify from "src/components/iconify/Iconify";

const TABLE_HEAD = [
  { id: "item", label: "Item Name", align: "left" },
  { id: "itemId", label: "Item ID", align: "left" },
  { id: "quantity", label: "Quantity", align: "left" },
  { id: "price", label: "Price", align: "center" },
  { id: "amount", label: "Amount", align: "center" },
];
const STATUS_OPTIONS = ["placed", "packed", "shipped", "delivered"];

// ----------------------------------------------------------------------
ReceiveNewEditDetails.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object,
  onCreate: PropTypes.func,
};
export default function ReceiveNewEditDetails({ data, onCreate, title }) {
  const [tableData, setTableData] = useState([]);
  const [customerOrder, setCustomerOrder] = useState({});
  const [isEditBillingAddress, setIsEditBillingAddress] = useState(false);
  const [isEditShippingAddress, setIsEditShippingAddress] = useState(false);

  const [tableAccounts, setTableAccounts] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
  });
  const [deliveryStatus, setDeliveryStatus] = useState(true);
  // ===================================================================================

  const {
    dense,
    order,
    orderBy,
    page,
    setPage,
    //
    selected,
    //
    onSort,
  } = useTable();

  const NewUserSchema = Yup.object().shape({
    status: Yup.string().nullable().required("Status is required"),
  });

  const defaultValues = {
    status: "",
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (data) {
      setCustomerOrder(data);
      if (data.products) setTableData(data.products);
      if (data.status) setValue("status", data.status);
    }
  }, [data]);

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
  }, [tableData]);

  const onSubmit = async (data) => {
    Api.put(apiUrls.customer.order.update(id), data)
      .then((res) => {
        if (res.result) {
          window.Toast("Your profile updated successfully");
          setIsEditBillingAddress(true);
          reset();
          // setLoadingSend(false);

          window.Toast(res.message);
          navigate(PATH_DASHBOARD.sales.order);
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    Api.get(apiUrls.customer.order.get(id))
      .then((res) => {
        if (res.result) {
          setCustomerOrder(res.data);
          setValue("billing.address", res.data?.billing?.address);
          setValue("billing.city", res.data?.billing?.city);
          setValue("billing.state", res.data?.billing?.state);
          setValue("billing.country", res.data?.billing?.country);
        } else {
          window.history.back();
        }
      })
      .catch((err) => {
        window.history.back();
      });
  }, []);

  const handleSaveBillingAddress = () => {
    setIsEditBillingAddress(true);

    setValue("billing.address", customerOrder?.billing?.address);
    setValue("billing.city", customerOrder?.billing?.city);
    setValue("billing.state", customerOrder?.billing?.state);
    setValue("billing.country", customerOrder?.billing?.country);
  };

  const handleSaveShippingAddress = () => {
    setIsEditShippingAddress(true);

    setValue("shipping.address", customerOrder?.shipping?.address);
    setValue("shipping.city", customerOrder?.shipping?.city);
    setValue("shipping.state", customerOrder?.shipping?.state);
    setValue("shipping.country", customerOrder?.shipping?.country);
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Stack sx={{ pt: 4, px: 3 }} spacing={1}>
            <Stack direction="row">
              <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                Order ID:
              </Typography>
              <Typography>{customerOrder?.id}</Typography>
            </Stack>

            <Stack direction="row">
              <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                Customer Name:
              </Typography>
              <Typography>{customerOrder?.customerName}</Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack sx={{ pt: 4, px: 3 }} spacing={1}>
            <Stack direction="row">
              <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                Order Date:
              </Typography>
              <Typography>{formateDate(customerOrder?.createdOn)}</Typography>
            </Stack>
            <Stack direction="row">
              <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                Payment Transaction ID:
              </Typography>
              <Typography>{customerOrder?.transactionId}</Typography>
            </Stack>
            <Stack direction="row">
              <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                Delivery Status:
              </Typography>
              <Typography>{customerOrder?.status}</Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={6}>
          <Card sx={{ pt: 2, px: 2, m: 3 }}>
            <Stack sx={{ p: 1 }}>
              <Stack sx={{ pb: 2, pt: 1 }}>
                <Typography variant="h6">Billing Address</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Address:
                </Typography>
                <Typography>
                  {customerOrder?.billingAddress?.address}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  City:
                </Typography>
                <Typography>{customerOrder?.billingAddress?.city}</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  State:
                </Typography>
                <Typography>{customerOrder?.billingAddress?.state}</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Country:
                </Typography>
                <Typography>
                  {customerOrder?.billingAddress?.country}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* <Card sx={{ m: 3 }}>
            <CardHeader
              title=" Delivery Address"
              action={
                !isEditShippingAddress && (
                  <Button
                    size="small"
                    startIcon={<Iconify icon="eva:edit-fill" />}
                    onClick={handleSaveShippingAddress}
                  >
                    Edit
                  </Button>
                )
              }
            />
            {!isEditShippingAddress ? (
              <CardContent>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Address:
                  </Typography>
                  <Typography>{customerOrder?.shipping?.address}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    City:
                  </Typography>
                  <Typography>{customerOrder?.shipping?.city}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    State:
                  </Typography>
                  <Typography>{customerOrder?.shipping?.state}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Country:
                  </Typography>
                  <Typography>{customerOrder?.shipping?.country}</Typography>
                </Stack>
              </CardContent>
            ) : (
              <DialogContent>
                <Stack spacing={1} sx={{ mt: 1, mb: 3 }}>
                  <RHFTextField
                    size="small"
                    name="shipping.address"
                    label="Address*"
                  />
                  <RHFTextField
                    size="small"
                    name="shipping.city"
                    label="City*"
                  />
                  <RHFTextField
                    size="small"
                    name="shipping.state"
                    label="State*"
                  />

                  <RHFSelect
                    native
                    name="shipping.country"
                    label="Country"
                    size="small"
                  >
                    <option value="" />
                    {countries.map((country) => (
                      <option key={country.code} value={country.label}>
                        {country.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Stack>
              </DialogContent>
            )}
          </Card> */}
          <Card sx={{ pt: 2, px: 2, m: 3 }}>
            <Stack sx={{ p: 1 }}>
              <Stack sx={{ pb: 2, pt: 1 }}>
                <Typography variant="h6">Shipping Address</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Address:
                </Typography>
                <Typography>
                  {customerOrder?.shippingAddress?.address}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  City:
                </Typography>
                <Typography>{customerOrder?.shippingAddress?.city}</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  State:
                </Typography>
                <Typography>{customerOrder?.shippingAddress?.state}</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Country:
                </Typography>
                <Typography>
                  {customerOrder?.shippingAddress?.country}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
      <Card sx={{ p: 2, m: 3 }}>
        <Stack>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Stack sx={{ p: 2 }}>
                <Typography variant="h6">Orders</Typography>
              </Stack>
              <Divider />

              <TableContainer sx={{ position: "relative", overflow: "unset" }}>
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
                        <OrderCreateTableRow1
                          key={row.id}
                          row={row}
                          index={index}
                        />
                      ))}

                      <TableNoData isNotFound={tableData.length == 0} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              <Divider />
              <Stack
                display="flex"
                justifyContent="end"
                direction="column"
                sx={{ mt: 2, mr: 4, float: "right" }}
                spacing={2}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={3}
                >
                  <Typography sx={{ minWidth: "130px" }}>Sub Total</Typography>
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
                  <Typography sx={{ minWidth: "130px" }}>Tax</Typography>
                  <Typography>{formateCurrency(tableAccounts.tax)}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={3}
                >
                  <Typography sx={{ minWidth: "130px" }}>Discount</Typography>
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
      <Grid item xs={12} md={12}>
        <Stack spacing={1} sx={{ pb: 3, p: 3 }}>
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
              name="status"
              label="Delivery Status"
              // InputLabelProps={{ shrink: true }}
            >
              {STATUS_OPTIONS.map((option) => (
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
