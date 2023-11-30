import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
// assets
import FormProvider, { RHFTextField } from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";
import Tax from "src/controller/settings/Tax.controller";
import apiUrls from "src/routes/apiUrls";
import { Api } from "src/utils";
// ----------------------------------------------------------------------

AddTaxDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.object,
};

export default function AddTaxDialog({ open, data, onClose }) {
  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required("Taxname is required"),
    rate: Yup.string().required("Rate is required"),
  });

  const [requestError, setRequestError] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const [loadingSend, setLoadingSend] = useState(false);
  let isEdit = typeof data == "object" ? true : false;
  const defaultValues = {
    name: "",
    rate: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    setLoadingSend(true);

    if (isEdit) {
      Tax.updateTax(data.id,data)
        .then((res) => {
          enqueueSnackbar("Tax updated successfully");
          reset({ ...defaultValues, ...res });
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message);
        });
    } else {
      Api.post(apiUrls.settings.tax.addTax, data)
        .then((res) => {
          if (res.result) {
            window.Toast("Tax created successfully");
            reset(defaultValues);
            onClose();
          } else {
            window.ToastError(res.message);
            enqueueSnackbar(res.message, { variant: "error" });
          }
        })
        .catch((error) => {});
    }
  };

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("rate", data.rate);
    } else {
      reset({
        id: null,
        name: "",
        rate: "",
      });
    }
  }, [data]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEdit ? "Edit Tax" : "Add Tax"}</DialogTitle>

        <DialogContent>
          <Stack spacing={1} sx={{ pt: 2 }}>
            <RHFTextField name="name" label="Tax Name*" size="small" />

            <RHFTextField name="rate" label="Rate(%)" size="small" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loadingSend && isSubmitting}
          >
            {isEdit ? "Update" : "Add"}
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
