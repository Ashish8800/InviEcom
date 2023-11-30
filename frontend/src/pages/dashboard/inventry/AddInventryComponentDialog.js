import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
// assets
import Manufacture from "src/controller/inventory/Manufacture.controller";
import InventryNewForm from "src/sections/@dashboard/inventry/form/InventryNewForm";
import FormProvider from "../../../components/hook-form";

// ----------------------------------------------------------------------

AddInventryComponentDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

export default function AddInventryComponentDialog({
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
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add Component</DialogTitle>

        <DialogContent dividers fullWidth>
          <InventryNewForm  onClose={onClose} />
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
