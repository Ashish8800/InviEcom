import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
// assets
import { useEffect, useState } from "react";
import FormProvider, {
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

// ----------------------------------------------------------------------

AddComponent.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function AddComponent({ open, onClose, list, onAdd }) {
  const [inventoryItemList, setInventoryItemList] = useState([]);

  const defaultValues = {
    ipn: "",
    itemType: "original",
    suggestedIpn: "",
    requestedQty: "",
    quotedQuantity: "",
    partNo: "",
    minimumQuantity: "",
    quotedLeadTime: "",
    quotedUnitPrice: "",
  };

  const FormValidation = Yup.object().shape({
    ipn: Yup.string().required("Select an IPN"),
    // suggestedIpn: Yup.string().required("Suggested Ipn is required"),
    requestedQty: Yup.string().required("Requested Qty is required"),
    quotedQuantity: Yup.string().required("Quoted Quantity is required"),
    partNo: Yup.string().required("Part No. is required"),
    minimumQuantity: Yup.string().required("Minimum Quantity is required"),
    quotedLeadTime: Yup.string().required("Quoted Lead Time is required"),
    quotedUnitPrice: Yup.string().required("Quoted Unit Price is required"),
  });

  const methods = useForm({
    resolver: yupResolver(FormValidation),
    defaultValues,
  });

  const { setValue, watch, handleSubmit, reset } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    reset(defaultValues);
    onAdd(data);
  };

  useEffect(() => {
    if (values.ipn) {
      const item = list.find((obj) => obj.ipn === values.ipn);
      console.log(item);
      setValue("requestedQty", item?.quantity);
      setValue("partNo", item?.mpn);
    }
  }, [values.ipn]);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add Component In Quotation</DialogTitle>

        <DialogContent dividers>
          <Box
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
            sx={{ pt: 2 }}
          >
            <RHFSelect size="small" fullWidth name="ipn" label="IPN">
              {list?.map((option) => {
                return (
                  <MenuItem key={option.ipn} value={option.ipn}>
                    {option.ipn}
                  </MenuItem>
                );
              })}
            </RHFSelect>

            <RHFRadioGroup
              row
              spacing={2}
              name="itemType"
              options={[
                {
                  label: "Original Component",
                  value: "original",
                },
                { label: "Suggestive Component", value: "suggestive" },
              ]}
            />

            {values.itemType === "suggestive" && (
              <Stack>
                <RHFSelect
                  size="small"
                  fullWidth
                  name="suggestedIpn"
                  label="Search for existing components..."
                >
                  {inventoryItemList?.map((option) => (
                    <MenuItem key={option.id + option.name} value={option.id}>
                      {option.ipn}
                    </MenuItem>
                  ))}
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    sx={{ marginTop: 1 }}
                    // onClick={handleComponentOpen}
                  >
                    Add New Components
                  </Button>
                </RHFSelect>
              </Stack>
            )}

            <Divider sx={{ gridColumn: "-1/1" }} />

            <TextField
              value={values.requestedQty}
              size="small"
              label="Requested Quantity"
              disabled
            />

            <TextField
              size="small"
              value={values.partNo}
              label="Part No."
              disabled
            />
            <RHFTextField
              size="small"
              name="quotedQuantity"
              label="Quoted Quantity"
            />
            <RHFTextField
              size="small"
              name="minimumQuantity"
              label="Minimum Quantity"
            />
            <RHFTextField
              size="small"
              name="quotedLeadTime"
              label="Quoted Lead Time"
            />
            <RHFTextField
              size="small"
              name="quotedUnitPrice"
              label="Quoted Unit Price"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            type="button"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            Add
          </Button>
          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
