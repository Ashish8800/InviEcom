import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// assets
import { countries } from "../../../assets/data";
import FormProvider, {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
} from "../../../components/hook-form";
import Manufacture from "src/controller/inventory/Manufacture.controller";

// ----------------------------------------------------------------------

AddManufacturerForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

export default function AddManufacturerForm({
  open,
  onClose,
  onCreateBilling,
}) {
  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required("Manufacturer name is required"),
  });

  const defaultValues = {
    name: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    Manufacture.create(data)
      .then((res) => {
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add Manufacturer</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} paddingTop={1}>
            <RHFTextField name="name" label="Manufacturer Name" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Add
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
