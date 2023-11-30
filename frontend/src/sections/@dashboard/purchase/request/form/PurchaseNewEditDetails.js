import sum from "lodash/sum";
import { useCallback, useEffect, useState } from "react";
// form
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
// @mui
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
// utils
// components
import { DatePicker } from "@mui/x-date-pickers";
import {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Iconify from "src/components/iconify";

import { Upload } from "src/components/upload";
import { REQUESTED_SOURCE } from "src/config-global";
import Item from "src/controller/inventory/Item.controller";
import Manufacture from "src/controller/inventory/Manufacture.controller";
import Warehouse from "src/controller/inventory/Warehouse.controller";
import Client from "src/controller/purchase/Client.controller";
import Project from "src/controller/purchase/Project.controller";
import User from "src/controller/userManagement/User.controller";
import AddClientDialog from "src/pages/dashboard/settings/client/AddClientDialog";
import AddProjectDialog from "src/pages/dashboard/settings/project/AddProjectDialog";

// ----------------------------------------------------------------------

export default function PurchaseNewEditDetails() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [customerList, setCustomerList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [systemUsersList, setSystemUsersList] = useState([]);
  const [approversList, setApproversList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [open, setOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [inventryItemList, setInventryItemList] = useState([]);
  const [preview, setPreview] = useState(false);
  const [files, setFiles] = useState([]);
  const [manufatureList, setManufatureList] = useState([]);

  const {
    fields: itemFields,
    append: itemAppend,
    remove: itemRemove,
  } = useFieldArray({
    control,
    name: "items",
  });

  const values = watch();

  const totalOnRow = values.items.map((item) => item.quantity * item.price);

  const total = sum(totalOnRow) - values.discount + values.taxes;

  useEffect(() => {
    setValue("total", total);
  }, [setValue, total]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    Project.list(
      values.clientId ? `?clientId=${values.clientId}&status=active` : ""
    ).then((res) => {
      setProjectList(res);
    });
  };

  const handleCustomerOpen = () => {
    setCustomerOpen(true);
  };

  const handleCustomerClose = () => {
    Client.list()
      .then((res) => {
        setCustomerList(res);
      })
      .catch((err) => console.log(err));
    setCustomerOpen(false);
  };

  const handleAdd = () => {
    itemAppend({
      id: null,
      ipn: "",
      shortDescription: "",
      mid: "",
      manufacturer: "",
      mpn: "",
      quantity: 1,
    });
  };

  const handleRemove = (index) => {
    itemRemove(index);
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

  useEffect(() => {
    Client.list("?status=active")
      .then((res) => {
        setCustomerList(res);
      })
      .catch((err) => console.log(err));

    User.list()
      .then((res) => setSystemUsersList(res))
      .catch((err) => `Api error ${err.message}`);

    Warehouse.list()
      .then((res) => {
        setWarehouseList(res);
      })
      .catch((err) => `Api error ${err.message}`);
  }, []);

  useEffect(() => {
    Project.list(values.clientId ? `?clientId=${values.clientId}` : "")
      .then((res) => setProjectList(res))
      .catch(() => setProjectList([]));

    customerList.forEach((item) => {
      if (item.id === values.clientId) setValue("clientName", item.name);
    });
  }, [values.clientId]);

  useEffect(() => {
    if (values.items.length == 0) handleAdd();
    Item.list()
      .then((res) => {
        console.log(res);
        setInventryItemList(res);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setFiles(values.files);
    setPreview(true);
  }, [values.files]);

  useEffect(() => {
    setApproversList(
      systemUsersList.filter((item) => item.id != values.indentor)
    );
  }, [values.indentor, systemUsersList]);

  const handleDropFile = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setPreview(true);
      setFiles([...files, ...newFiles]);
      setValue("files", [...files, ...newFiles]);
    },
    [files]
  );

  const handleRemoveFiles = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
    setValue("files", filtered);
  };

  useEffect(() => {
    Manufacture.list()
      .then((result) => setManufatureList(result))
      .catch((error) => console.log(error));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        rowGap={2}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
        }}
      >
        <Stack spacing={2}>
          {/* Request By */}
          <RHFSelect size="small" fullWidth name="indentor" label="Indentor *">
            {systemUsersList?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </RHFSelect>

          {/* Request Source */}
          <RHFSelect
            size="small"
            fullWidth
            name="requestSource"
            label="Requested Sources *"
          >
            {REQUESTED_SOURCE.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </RHFSelect>
          {values?.requestSource == "others" && (
            <RHFTextField
              size="small"
              name="requestSourceDetails"
              label="Source Detail"
            />
          )}

          <Controller
            name="deliveryDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label="Expected Delivery Date"
                inputFormat="dd/MM/yyyy"
                value={field.value}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
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
        </Stack>

        <Stack spacing={2}>
          <RHFSelect size="small" fullWidth name="clientId" label="Client Name">
            {customerList &&
              customerList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </RHFSelect>

          <RHFSelect
            size="small"
            fullWidth
            name="projectId"
            label="Project Name"
          >
            {projectList?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFSelect
            size="small"
            fullWidth
            name="deliverTo"
            label="Deliver to Warehouse *"
          >
            {warehouseList?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
      </Box>

      <Divider sx={{ my: 2, borderStyle: "dashed" }} />

      <Typography variant="h6" sx={{ mb: 1 }}>
        Component Details
      </Typography>

      <Stack spacing={3}>
        {itemFields.map((item, index) => {
          return (
            <Stack
              key={`${item.id}_${index}`}
              alignItems="flex-end"
              spacing={1.5}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems="center"
                spacing={2}
                sx={{ width: 1 }}
              >
                <RHFAutocomplete
                  fullWidth
                  size="small"
                  name={`items[${index}].ipn`}
                  label="IPN (Inevitable Part Number)*"
                  ChipProps={{ size: "small" }}
                  options={inventryItemList}
                  getOptionLabel={(option) =>
                    typeof option == "object" ? option.ipn : option
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.name === value
                  }
                  onChange={(e, value) => {
                    console.log("values from select:", value);

                    setValue(`items[${index}].id`, value.id);
                    setValue(`items[${index}].ipn`, value.ipn);
                    setValue(
                      `items[${index}].manufacturer_list`,
                      value?.manufacturer
                    );

                    setValue(`items[${index}].mid`, "");
                    setValue(`items[${index}].manufacturer`, "");
                    setValue(`items[${index}].mpn`, "");

                    setValue(
                      `items[${index}].shortDescription`,
                      value.shortDescription
                    );
                    // setValue(`items[${index}].mpn`, value.manufacturer.mpn);
                  }}
                />
                <RHFTextField
                  disabled={true}
                  size="small"
                  type="string"
                  name={`items[${index}].shortDescription`}
                  label="Description *"
                  // sx={{ maxWidth: { md: 150 } }}
                />
              </Stack>
              <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems="center"
                spacing={2}
                sx={{ width: 1 }}
              >
                <RHFAutocomplete
                  fullWidth
                  size="small"
                  name={`items[${index}].manufacturer`}
                  label="Manufacturer *"
                  placeholder="manufacturer"
                  ChipProps={{ size: "small" }}
                  options={values?.items[index]?.manufacturer_list ?? []}
                  getOptionLabel={(option) =>
                    typeof option == "object" ? option.name : option
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.name === value
                  }
                  onChange={(e, value) => {
                    // alert(JSON.stringify(value));
                    setValue(`items[${index}].mid`, value.id);
                    setValue(
                      `items[${index}].manufacturer`,
                      value.name ?? "unknown"
                    );
                    setValue(`items[${index}].mpn`, value?.mpn);
                  }}
                />

                <RHFTextField
                  disabled
                  size="small"
                  type="string"
                  name={`items[${index}].mpn`}
                  label="MPN *"
                  sx={{ maxWidth: { md: 300 } }}
                />
                <RHFTextField
                  size="small"
                  type="number"
                  name={`items[${index}].quantity`}
                  label="Quantity *"
                  placeholder="0"
                  onChange={(event) => handleChangeQuantity(event, index)}
                  sx={{ maxWidth: { md: 150 } }}
                />

                <Button
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                  onClick={() => handleRemove(index)}
                  sx={{ paddingX: 3 }}
                ></Button>
              </Stack>
            </Stack>
          );
        })}

        <Typography sx={{ mb: 1 }} color="error">
          {errors?.items?.message}
        </Typography>
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
          Add Component
        </Button>
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
        <Stack spacing={2}>
          <RHFTextField
            size="small"
            name="description"
            label="Notes"
            multiline
            rows={5}
          />

          <RHFSelect
            size="small"
            fullWidth
            name="prApprover"
            label="PR Request Approver *"
          >
            {approversList.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
        <Stack spacing={1}>
          <Upload
            multiple
            files={files}
            thumbnail={preview}
            onDrop={handleDropFile}
            onRemove={handleRemoveFiles}
          />
        </Stack>
      </Box>

      <AddClientDialog open={customerOpen} onClose={handleCustomerClose} />

      <AddProjectDialog
        open={open}
        onClose={handleClose}
        client={values.clientName}
      />
    </Box>
  );
}
