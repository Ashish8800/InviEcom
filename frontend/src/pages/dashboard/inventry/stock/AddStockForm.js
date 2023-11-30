import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
// assets
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Item from "src/controller/inventory/Item.controller";
import Stock from "src/controller/inventory/Stock.controller";
import Warehouse from "src/controller/inventory/Warehouse.controller";
// ----------------------------------------------------------------------

AddStockForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function AddStockForm({ open, data, onClose }) {
  const StockFormSchema = Yup.object().shape({
    ipn: Yup.string().required("IPN is required"),
    warehouseId: Yup.string().required("Warehouse is required"),
  });

  const [stock, setStock] = useState({
    stock: 0,
  });

  const [requestError, setRequestError] = useState("");
  const [warehouseList, setWarehouseList] = useState([]);
  const [inputWareHouse, setInputWareHouse] = useState(null);
  const [itemList, setItemList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  let isEdit = typeof data == "object" ? true : false;

  const defaultValues = {
    ipn: "",
    warehouseId: "",
    shortDescription: "",
    stock: "",
  };

  const methods = useForm({
    resolver: yupResolver(StockFormSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    if (isEdit) {
      Stock.update(data)
        .then((res) => {
          enqueueSnackbar("Stock updated successfully");
          reset({ ...defaultValues, ...res });
          onClose();
        })
        .catch((error) => {
          window.ToastError(error.message, { variant: "error" });
        });
    } else {
      Stock.create(data)
        .then(() => {
          enqueueSnackbar("Stock created successfully");
          reset(defaultValues);
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message, { variant: "error" });
          enqueueSnackbar(error.message, { variant: "error" });
        });
    }
  };
  // const onSubmit = async (data) => {
  //   if (!data.id) {
  //     Stock.create(data)
  //       .then((result) => {
  //         reset();
  //         window.Toast("Stock created successfully");
  //         onClose();
  //       })
  //       .catch((error) => {
  //         setRequestError(error.message);
  //       });
  //   } else {
  //     console.log("update Stock called");
  //     Stock.update(data)
  //       .then((result) => {
  //         window.Toast("Stock updated successfully");
  //         onClose();
  //       })
  //       .catch((error) => {
  //         setRequestError(error.message);
  //       });
  //   }
  // };

  useEffect(() => {
    Warehouse.list()
      .then((data) => {
        setWarehouseList(data);
      })
      .catch((err) => console.log(err));

    Item.list()
      .then((data) => {
        setItemList(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("ipn", data.ipn);
      setValue("warehouseId", data.warehouseId);
      setValue("stock", data.stock);
    } else {
      reset({
        id: null,
        ipn: "",
        warehouseId: "",
        stock: "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (values.ipn && values.warehouseId) {
      Stock.list(`?ipn=${values.ipn}&warehouseId=${values.warehouseId}`)
        .then((res) => {
          // Check if the response contains data and update stock accordingly
          if (res && res.length > 0 && res[0].hasOwnProperty("stock")) {
            setStock({
              stock: res[0].stock,
            });
          } else {
            // Handle the case where the response doesn't contain stock data
            setStock({
              stock: 0,
            });
          }
        })
        .catch((err) => {
          // Handle API call errors here
          console.log(err);
          // You can choose to set stock to 0 or handle it differently here
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.warehouseId]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEdit ? "Edit Stock" : "Add Stock"}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {Boolean(requestError) && (
              <Alert severity="error">{requestError}</Alert>
            )}
            <Stack
              spacing={1}
              display="flex"
              justifyContent="space-between"
              direction="row"
            >
              <RHFAutocomplete
                fullWidth
                size="small"
                name={`ipn`}
                label="IPN*"
                ChipProps={{ size: "small" }}
                options={itemList}
                getOptionLabel={(option) =>
                  typeof option == "object"
                    ? `${option.ipn} [ ${option.shortDescription} ]`
                    : option
                }
                isOptionEqualToValue={(option, value) => option.ipn === value}
                onChange={(e, value) => {
                  setValue(`ipn`, value.ipn);
                  setValue(`shortDescription`, value.shortDescription);
                }}
              />

              <RHFSelect size="small" name="warehouseId" label="Warehouse">
                {warehouseList?.map((option) => (
                  <MenuItem key={option} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>

            <Stack m={0}>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  IPN Description:
                </Typography>
                <Typography>{values?.shortDescription}</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Current Stock:
                </Typography>
                <Typography>{stock.stock}</Typography>
              </Stack>
            </Stack>

            <RHFTextField size="small" name="stock" label="Stock" />
          </Stack>
        </DialogContent>
        <Divider sx={{ mt: 4 }}></Divider>

        <Stack
          display="flex"
          justifyContent="space-between"
          direction="row"
          alignItems="center"
        >
          <Stack
            direction="row"
            pl={3}
            justifyContent="center"
            alignItems="center"
          >
            <Typography paragraph sx={{ color: "text.disabled", pr: 1, mb: 0 }}>
              Total Stock:
            </Typography>
            <Typography variant="h6">
              {parseInt(stock.stock) + parseInt(values.stock) || 0}
            </Typography>
          </Stack>

          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {isEdit ? "Update" : "Add"}
            </LoadingButton>

            <Button color="error" variant="contained" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}
