import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Controller } from "react-hook-form";
// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DatePicker } from "@mui/x-date-pickers";

// assets
import { countries } from "../../../assets/data";
import FormProvider, {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
} from "../../../components/hook-form";
import PurchaseInvoice from "src/controller/purchase/PurchaseInvoice.controller";
import { useEffect } from "react";
// import Typography from "src/theme/overrides/Typography";

// ----------------------------------------------------------------------

const PAYMENT_MODE = ["upi", "internet banking", "credit card", "debit card"];

PaymentUpdateForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  invoice: PropTypes.object,
};

export default function PaymentUpdateForm({ open, onClose, invoice }) {
  const validationSchema = Yup.object().shape({
    paymentDate: Yup.string().nullable().required("Payment date is required"),
    paymentMode: Yup.string().required("Payment mode is required"),
    paidAmount: Yup.string().required("Paid amount is required"),
  });

  const defaultValues = {
    paymentDate: null,
    paymentMode: "",
    paidAmount: "",
    id: "",
  };

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  const values = watch();

  useEffect(() => {
    console.log(invoice);
    setValue("id", invoice?.id);
    setValue("paymentDate", invoice?.paymentDate);
    setValue("paymentMode", invoice?.paymentMode);
    setValue("paidAmount", invoice?.paidAmount);
  }, [invoice]);

  const onSubmit = async (data) => {
    console.log(data);

    PurchaseInvoice.update(data)
      .then((res) => {
        onClose();
        window.Toast("Payment details updated");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Payment Update</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <Stack>
              <Typography>Invoice Id: {values.id}</Typography>
            </Stack>

            <Controller
              name="paymentDate"
              // control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Payment Date"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
            <RHFSelect small="small" name="paymentMode" label="Payment Mode">
              {PAYMENT_MODE.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField name="paidAmount" label="Paid Amount" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Add Payment
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
