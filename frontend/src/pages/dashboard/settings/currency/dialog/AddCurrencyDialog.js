import PropTypes from "prop-types";
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
import { useEffect, useState } from "react";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";
import Currency from "src/controller/settings/Currency.controller";
// ----------------------------------------------------------------------

AddCurrencyDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

export default function AddCurrencyDialog({
  open,
  onClose,
  onCreateBilling,
  data,
}) {
  const NewCurrencySchema = Yup.object().shape({
    name: Yup.string().required("Currency name is required"),
    symbol: Yup.string().required("Symbol is required"),
  });

  let isEdit = typeof data == "object" ? true : false;

  const defaultValues = {
    name: "",
    symbol: "",
  };

  const [requestError, setRequestError] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(NewCurrencySchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);

    if (isEdit) {
      Currency.update(data.id,data)
        .then((res) => {
          enqueueSnackbar("Currency updated successfully");
          reset({ ...defaultValues, ...res });
          console.log(res);
          onClose();
        })
        .catch((error) => {
          window.ToastError(error.message);
        });
    } else {
      Currency.create(data)
        .then(() => {
          window.Toast("Currency created successfully");

          reset(defaultValues);
          onClose();
        })
        .catch((error) => {
          window.ToastError(error.message);
        });
    }
  };

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("symbol", data.symbol);
    } else {
      reset({
        id: null,
        name: "",
        symbol: "",
      });
    }
  }, [data]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEdit ? "Edit Currency" : "New currency"}</DialogTitle>

        <DialogContent>
          <Stack spacing={1} sx={{ pt: 1 }}>
            <RHFTextField name="name" label="Currency Name" size="small" />

            <RHFTextField name="symbol" label="Currency Symbol" size="small" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {isEdit ? "Update" : "Save"}
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
