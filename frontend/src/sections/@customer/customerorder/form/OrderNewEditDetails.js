import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// form
import { useFormContext } from "react-hook-form";
// @mui
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import { countries } from "src/assets/data";

import Scrollbar from "src/components/scrollbar";
// utils
// components
import { RHFSelect, RHFTextField } from "../../../../components/hook-form";

// _mock_

import Iconify from "src/components/iconify/Iconify";
import { TableHeadCustom, TableNoData, useTable } from "src/components/table";
import OrderCreateTableRow1 from "src/sections/@customer/customerorder/list/OrderCreateTableRow1.js";
import { formateCurrency } from "src/utils";

const TABLE_HEAD = [
  { id: "srNo", label: " SR.No", align: "center" },
  { id: "item", label: "Item Name", align: "left" },
  { id: "itemId", label: "Item ID", align: "center" },
  { id: "quantity", label: "Quantity", align: "center" },
  { id: "price", label: "Price", align: "center" },
  { id: "amount", label: "Amount", align: "center" },
];

// ----------------------------------------------------------------------

export default function ReceiveNewEditDetails({
  data,
  saveBillingAddress,
  saveShippingAddress,
}) {
  const [tableData, setTableData] = useState([]);
  const [customerOrder, setCustomerOrder] = useState({});
  const [tableAccounts, setTableAccounts] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
  });
  // ===================================================================================

  const {
    dense,
    order,
    orderBy,
    //
    selected,
    //
    onSort,
  } = useTable();

  const { id } = useParams();

  const { control, setValue, watch, resetField } = useFormContext();

  const [isEditBillingAddress, setIsEditBillingAddress] = useState(false);
  const [isEditShippingAddress, setIsEditShippingAddress] = useState(false);

  const handleSaveBillingAddress = () => {
    setIsEditBillingAddress(true);

    setValue("billingAddress.address", customerOrder?.billingAddress?.address);
    setValue("billingAddress.city", customerOrder?.billingAddress?.city);
    setValue("billingAddress.state", customerOrder?.billingAddress?.state);
    setValue("billingAddress.country", customerOrder?.billingAddress?.country);
  };

  const handleSaveShippingAddress = () => {
    setIsEditShippingAddress(true);

    setValue(
      "shippingAddress.address",
      customerOrder?.shippingAddress?.address
    );
    setValue("shippingAddress.city", customerOrder?.shippingAddress?.city);
    setValue("shippingAddress.state", customerOrder?.shippingAddress?.state);
    setValue(
      "shippingAddress.country",
      customerOrder?.shippingAddress?.country
    );
  };

  useEffect(() => {
    if (data) {
      setCustomerOrder(data);
      if (data.products) setTableData(data.products);
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
                Customer ID:
              </Typography>
              <Typography>{customerOrder?.customerId}</Typography>
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
              <Typography>{customerOrder?.createdOn}</Typography>
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
          <Card sx={{ m: 3 }}>
            <CardHeader
              title="Billing Address"
              action={
                !isEditBillingAddress &&
                (customerOrder?.status == "placed" ||
                  customerOrder?.status == "packed") && (
                  <Button
                    size="small"
                    startIcon={<Iconify icon="eva:edit-fill" />}
                    onClick={handleSaveBillingAddress}
                  >
                    Edit
                  </Button>
                )
              }
            />
            {!isEditBillingAddress ? (
              <CardContent>
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
                  <Typography>
                    {customerOrder?.billingAddress?.state}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Country:
                  </Typography>
                  <Typography>
                    {customerOrder?.billingAddress?.country}
                  </Typography>
                </Stack>
              </CardContent>
            ) : (
              <Stack sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <RHFTextField
                    size="small"
                    name="billingAddress.address"
                    label="Address*"
                  />
                  <RHFTextField
                    size="small"
                    name="billingAddress.city"
                    label="City*"
                  />
                  <RHFTextField
                    size="small"
                    name="billingAddress.state"
                    label="State*"
                  />

                  <RHFSelect
                    native
                    name="billingAddress.country"
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
                <Stack
                  display="flex"
                  justifyContent="flex-end"
                  direction="row"
                  spacing={1}
                  sx={{ pt: 2 }}
                >
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={(e) => {
                      saveBillingAddress(e);
                      setIsEditBillingAddress(false);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={(e) => {
                      setIsEditBillingAddress(false);
                    }}
                    color="error"
                  >
                    cancel
                  </Button>
                </Stack>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ m: 3 }}>
            <CardHeader
              title="Shipping Address"
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
                  <Typography>
                    {customerOrder?.shippingAddress?.address}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    City:
                  </Typography>
                  <Typography>
                    {customerOrder?.shippingAddress?.city}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    State:
                  </Typography>
                  <Typography>
                    {customerOrder?.shippingAddress?.state}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Country:
                  </Typography>
                  <Typography>
                    {customerOrder?.shippingAddress?.country}
                  </Typography>
                </Stack>
              </CardContent>
            ) : (
              <Stack sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <RHFTextField
                    size="small"
                    name="shippingAddress.address"
                    label="Address*"
                  />
                  <RHFTextField
                    size="small"
                    name="shippingAddress.city"
                    label="City*"
                  />
                  <RHFTextField
                    size="small"
                    name="shippingAddress.state"
                    label="State*"
                  />

                  <RHFSelect
                    native
                    name="shippingAddress.country"
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
                <Stack
                  display="flex"
                  justifyContent="flex-end"
                  direction="row"
                  spacing={1}
                  sx={{ pt: 2 }}
                >
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={(e) => {
                      saveShippingAddress(e);
                      setIsEditShippingAddress(false);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={(e) => {
                      setIsEditShippingAddress(false);
                    }}
                    color="error"
                  >
                    cancel
                  </Button>
                </Stack>
              </Stack>
            )}
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
      {customerOrder.status != "canceled" && (
        <Grid item xs={12} md={12}>
          <Stack spacing={1} sx={{ p: 3, pt: 1 }}>
            <RHFTextField
              name="comment"
              label="Comments"
              row={6}
            ></RHFTextField>
          </Stack>
        </Grid>
      )}
    </Box>
  );
}
