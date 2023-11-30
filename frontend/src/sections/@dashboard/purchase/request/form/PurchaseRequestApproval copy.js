import PropTypes from "prop-types";

import sum from "lodash/sum";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { Controller } from "react-hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import Iconify from "../../../../components/iconify";
// routes
import { PATH_CUSTOMER } from "src/routes/paths";
// components
import FormProvider, {
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  RHFUpload,
} from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";
import { fCurrency } from "../../../../utils/formatNumber";

import AddClientDialog from "src/pages/dashboard/settings/client/AddClientDialog";
import AddProjectDialog from "src/pages/dashboard/settings/project/AddProjectDialog";

// ----------------------------------------------------------------------

const PR_OPTIONS = ["user list", "role list"];
const CUSTOMER_NAME = ["Riya singh", "shweta awasthi", "priya pandey"];
const PROJECT_OPTIONS = ["HRMS", "INVIFOTA", "CRM"];

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();
  // const { control, setValue, watch, resetField } = useFormContext();

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "items",
  // });

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    images: Yup.array().min(1, "Images is required"),
    tags: Yup.array().min(2, "Must have at least 2 tags"),
    price: Yup.number().moreThan(0, "Price should not be $0.00"),
    description: Yup.string().required("Description is required"),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || "",
      description: currentProduct?.description || "",
      images: currentProduct?.images || [],
      code: currentProduct?.code || "",
      sku: currentProduct?.sku || "",
      price: currentProduct?.price || 0,
      priceSale: currentProduct?.priceSale || 0,
      inStock: true,
      taxes: true,
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? "Create success!" : "Update success!");
      navigate(PATH_CUSTOMER.product.list);
      console.log("DATA", data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue("images", [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered =
      values.images && values.images?.filter((file) => file !== inputFile);
    setValue("images", filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue("images", []);
  };
  const handleRemove = (index) => {
    remove(index);
  };
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

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [customerOpen, setCustomerOpen] = useState(false);

  const handleCustomerOpen = () => {
    setCustomerOpen(true);
  };

  const handleCustomerClose = () => {
    setCustomerOpen(false);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ p: 3 }}>
        <Stack>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFTextField name="title_edit" label="Purchase Request Number*" />
            <RHFTextField name="indentor" label="Requested By" />
            <Stack>
              <RHFSelect
                fullWidth
                name="clientName"
                label="Client Name"
                // InputLabelProps={{ shrink: true }}
              >
                {CUSTOMER_NAME.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
                <MenuItem>
                  <Button
                    fullWidth
                    color="inherit"
                    variant="outlined"
                    size="large"
                    onClick={handleCustomerOpen}
                  >
                    Add Client
                  </Button>
                </MenuItem>
              </RHFSelect>
              <AddClientDialog
                open={customerOpen}
                onClose={handleCustomerClose}
              />
            </Stack>
            <Controller
              name="deliveryDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Expected Delivery Date"
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
            <Stack>
              <RHFSelect
                fullWidth
                name="projectName"
                label="Project Name"
                // InputLabelProps={{ shrink: true }}
              >
                {PROJECT_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
                <MenuItem>
                  <Button
                    fullWidth
                    color="inherit"
                    variant="outlined"
                    size="large"
                    onClick={handleOpen}
                  >
                    Add Project
                  </Button>
                </MenuItem>
              </RHFSelect>
              <AddProjectDialog open={open} onClose={handleClose} />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                Deliver To
              </Typography>

              <RHFRadioGroup
                row
                spacing={4}
                name="Deliver To"
                options={[
                  { label: "Warehouse", value: "Warehouse" },
                  { label: "Customer", value: "Customer" },
                ]}
              />
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 3, borderStyle: "dashed" }} />
        <Typography variant="h6" sx={{ mb: 3 }}>
          Items
        </Typography>

        <Stack
          divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
          spacing={3}
        >
          {fields.map((item, index) => (
            <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ width: 1 }}
              >
                <RHFTextField
                  size="small"
                  name={`items[${index}].title`}
                  label="Item name"
                  InputLabelProps={{ shrink: true }}
                />

                <RHFTextField
                  size="small"
                  type="number"
                  name={`items[${index}].quantity`}
                  label="Quantity"
                  placeholder="0"
                  onChange={(event) => handleChangeQuantity(event, index)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ maxWidth: { md: 96 } }}
                />
                <RHFTextField
                  size="small"
                  name={`items[${index}].price`}
                  label="Rate"
                  InputLabelProps={{ shrink: true }}
                />

                <RHFTextField
                  size="small"
                  type="number"
                  name={`items[${index}].price`}
                  label="Price"
                  placeholder="0"
                  onChange={(event) => handleChangePrice(event, index)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: { md: 96 } }}
                />

                <Button
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ my: 3, borderStyle: "dashed" }} />

        <Stack
          spacing={2}
          direction={{ xs: "column-reverse", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Button
            size="small"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAdd}
            sx={{ flexShrink: 0 }}
          >
            Add Item
          </Button>

          <Stack
            spacing={2}
            justifyContent="flex-end"
            direction={{ xs: "column", md: "row" }}
            sx={{ width: 1 }}
          >
            <Stack direction="row" justifyContent="flex-end">
              <Typography>Subtotal :</Typography>
              <Typography sx={{ textAlign: "right", width: 120 }}>
                {fCurrency(sum(totalOnRow)) || "-"}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Stack direction="row" justifyContent="flex-end">
            <Typography>Taxes :</Typography>
            <Typography sx={{ textAlign: "right", width: 120 }}>
              {values.taxes ? fCurrency(values.taxes) : "-"}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="flex-end">
            <Typography variant="h6">Total Price :</Typography>
            <Typography variant="h6" sx={{ textAlign: "right", width: 120 }}>
              {fCurrency(totalPrice) || "-"}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3, borderStyle: "dashed" }} />
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
        >
          <Stack spacing={2} sx={{ mt: 3 }}>
            <RHFTextField
              name="description"
              label="Customer Notes"
              multiline
              rows={3}
            />

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
          </Stack>
          <Stack spacing={1}>
            <RHFUpload
              name="cover"
              maxSize={3145728}
              onDrop={handleDrop}
              onDelete={handleRemoveFile}
            />
          </Stack>
        </Box>
      </Box>
    </FormProvider>
  );
}
