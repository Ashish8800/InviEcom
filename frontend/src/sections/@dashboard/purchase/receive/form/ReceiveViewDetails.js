import sum from "lodash/sum";
import { useCallback, useEffect, useState } from "react";
// form
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
// @mui
import {
  Box,
  Stack,
  Grid,
  Card,
  Typography,
  MenuItem,
  TextField,
} from "@mui/material";
// utils
// components
import {
  RHFSelect,
  RHFTextField,
  RHFUpload,
} from "src/components/hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import PurchaseInvoice from "src/controller/purchase/PurchaseInvoice.controller";
import { formateCurrency } from "src/utils";
import { useParams } from "react-router";
import PurchaseReceive from "src/controller/purchase/PurchaseReceive.controller";
import Image from "src/components/image/Image";

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  { id: 1, name: "full stack development", price: 90.99 },
  { id: 2, name: "backend development", price: 80.99 },
  { id: 3, name: "ui design", price: 70.99 },
  { id: 4, name: "ui/ux design", price: 60.99 },
  { id: 5, name: "front end development", price: 40.99 },
];
const PAYMENT_MODE = ["upi", "internet banking", "credit card", "debit card"];
const PAID_Vendor = ["10%", "20%", "50%", "100%"];

// ----------------------------------------------------------------------

export default function ReceiveViewDetails({ pr }) {
  const { control, setValue, watch, resetField, reset } = useFormContext();
  const values = watch();

  const [purchaseInvoiceList, setPurchaseInvoiceList] = useState([]);
  const [purchaseInvoice, setPurchaseInvoice] = useState({});

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

  useEffect(() => {
    PurchaseInvoice.list("?status=approved")
      .then((res) => {
        setPurchaseInvoiceList(res);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (purchaseInvoiceList.length > 0 && values.purchaseOrderId) {
      purchaseInvoiceList.forEach((item) => {
        if (item.purchaseOrderId === values.purchaseOrderId) {
          setPurchaseInvoice(item);
        }
      });
    }
  }, [values.purchaseOrderId, purchaseInvoiceList]);

  const { id } = useParams();

  useEffect(() => {
    if (id != "")
      PurchaseReceive.get(id).then((res) => {
        console.log(res);
        const defaultValues = {
          purchaseOrderId: res.purchaseOrderId,
          receiveDate: res.receiveDate,
          paymentDate: res.paymentDate,
          paidToVendor: res.paidToVendor,
          paymentMode: res.paymentMode,
          paidAmount: res.paidAmount,
          comment: res.comment,
          id: res.id,
          cover: {
            preview: res.thumbnail,
          },
        };
        reset(defaultValues);
      });
  }, [id]);

  // useEffect(() => {
  //   setTableData(pr?.po?.items ?? []);
  // }, [pr]);
  // console.log(pr);

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Stack spacing={2}>
            <RHFTextField
              disabled="true"
              name="purchaseOrderId"
              label="PO Number"
            >
              {" "}
              {pr?.po?.id}
            </RHFTextField>
            <Controller
              name="receiveDate"
              label="Receive Date"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  disabled="true"
                  label="Receive Date"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled="true"
                      size="small"
                      {...params}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              name="paymentDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  disabled="true"
                  label="Payment Date"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled="true"
                      size="small"
                      {...params}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />

            <RHFSelect
              disabled="true"
              size="small"
              small
              name="paidToVendor"
              label="Paid To (Vendor)"
            >
              {PAID_Vendor.map((option, index) => (
                <MenuItem key={`${option}_${index}`} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect
              disabled="true"
              size="small"
              small
              name="paymentMode"
              label="Payment Mode"
            >
              {PAYMENT_MODE.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField
              disabled="true"
              size="small"
              name="paidAmount"
              label="Paid Amount"
            />
            <RHFTextField
              disabled="true"
              size="small"
              name="comment"
              label="Comment"
              multiline
              rows={3}
            />
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} sx={{ p: 2 }}>
        <Card sx={{ p: 2 }}>
          <Stack spacing={1} fullWidth>
            <Stack
              fullWidth
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={3}
            >
              <Typography>Vendor Name:</Typography>
              <Typography>{pr?.vendorDetails?.vendorDisplayName}</Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={3}
            >
              <Typography>Vendor Address:</Typography>
              <Typography>
                {`${pr?.vendorDetails?.billing?.address ?? ""} ${
                  pr?.vendorDetails?.billing?.city ?? ""
                } ${pr?.vendorDetails?.billing?.state ?? ""} ${
                  pr?.vendorDetails?.billing?.country ?? ""
                } ${pr?.vendorDetails?.billing?.pincode ?? ""} `}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={3}
            >
              <Typography>Invoice Amount:</Typography>
              <Typography>
                {formateCurrency(purchaseInvoice?.totalAmount)}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={3}
            >
              <Typography>PO Items:</Typography>
              <Typography>
                {pr?.pr?.items?.map((item) => (
                  <Typography>{item.name}, </Typography>
                ))}
              </Typography>
            </Stack>
          </Stack>
        </Card>
        <Grid>
          <Stack spacing={1} sx={{ mt: 3 }}>
            <Image
              disabled="true"
              name="cover"
              src={pr?.thumbnail}
              maxSize={3145728}
              onDrop={handleDrop}
              onDelete={handleRemoveFile}
            />
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}
