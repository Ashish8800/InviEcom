import sum from "lodash/sum";
import { useEffect, useState } from "react";
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

import { useCallback } from "react";
import Iconify from "src/components/iconify/Iconify";
import { Upload } from "src/components/upload";
import { REQUESTED_SOURCE } from "src/config-global";
import Item from "src/controller/inventory/Item.controller";
import Warehouse from "src/controller/inventory/Warehouse.controller";
import Client from "src/controller/purchase/Client.controller";
import Project from "src/controller/purchase/Project.controller";
import User from "src/controller/userManagement/User.controller";
import Comment from "src/sections/@dashboard/blog/comment/Comment";
// ----------------------------------------------------------------------
const SOURCE_OPTIONS = ["", "Email", "Contact Number"];
export default function PurchaseNewEditDetails() {
  const { control, setValue, watch } = useFormContext();
  const [warehouseList, setWarehouseList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [systemUsersList, setSystemUsersList] = useState([]);
  const [preview, setPreview] = useState(false);
  const [files, setFiles] = useState([]);
  const [inventryItemList, setInventryItemList] = useState([]);

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

  const handleAdd = () => {
    itemAppend({
      id: null,
      name: "",
      quantity: 1,
      ipn: "",
      manufacturer_name: "",
      manufacturer: "",
      mpn: "",
      shortDescription: "",
      price: 0,
      total: 0,
    });
  };

  const handleRemove = (index) => {
    itemRemove(index);
  };
  useEffect(() => {
    Client.list()
      .then((res) => {
        setCustomerList(res);
      })
      .catch((err) => console.log(err));

    User.list().then((res) => setSystemUsersList(res));
    Warehouse.list().then((res) => {
      setWarehouseList(res);
    });
  }, []);

  useEffect(() => {
    Project.list(values.clientId ? `?clientId=${values.clientId}` : "")
      .then((res) => setProjectList(res))
      .catch((err) => setProjectList([]));

    customerList.forEach((item) => {
      if (item.id == values.clientId) setValue("clientName", item.name);
    });
  }, [values.clientId]);

  useEffect(() => {
    if (values.items.length == 0) handleAdd();
    Item.list()
      .then((res) => setInventryItemList(res))
      .catch((err) => console.log(err));
  }, []);

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
    setFiles(values.files);
    setPreview(true);
  }, [values.files]);

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
  };
  return (
    <Box sx={{ p: 3 }}>
      <Stack>
        <Stack>
          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              PR Number:
            </Typography>
            <Typography>{values.id}</Typography>
          </Stack>
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
              {/* Request By */}
              <RHFSelect
                size="small"
                fullWidth
                name="indentor"
                label="Indentor"
              >
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
                label="Requested Sources"
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

              {/* Expected delivery date */}
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
              <RHFSelect
                size="small"
                fullWidth
                name="clientId"
                label="Client Name"
              >
                {customerList &&
                  customerList.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}

                {/* <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCustomerOpen}
                sx={{ mt: 2 }}
              >
                Add Client
              </Button> */}
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
                label="Deliver to Warehouse"
              >
                {warehouseList?.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 2, borderStyle: "dashed" }} />
        <Typography variant="h6" sx={{ mb: 1, color: "text.disabled" }}>
          Components 
        </Typography>

        <Stack
          divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
          spacing={3}
        >
          {itemFields.map((item, index) => (
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
                  label="IPN (Inevitable Part Number)"
                  ChipProps={{ size: "small" }}
                  options={inventryItemList}
                  getOptionLabel={(option) =>
                    typeof option == "object" ? option.ipn : option
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.name === value
                  }
                  onChange={(e, value) => {
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
                  size="small"
                  type="string"
                  name={`items[${index}].shortDescription`}
                  label="Description"
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
                  label="Manufacturer"
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
                    setValue(`items[${index}].mid`, value.id);
                    setValue(`items[${index}].manufacturer`, value?.name);
                    setValue(`items[${index}].mpn`, value?.mpn);
                  }}
                />

                <RHFTextField
                  size="small"
                  type="string"
                  name={`items[${index}].mpn`}
                  label="MPN"
                  sx={{ maxWidth: { md: 425} }}
                />
                <RHFTextField
                  size="small"
                  type="number"
                  name={`items[${index}].quantity`}
                  label="Quantity"
                  placeholder="0"
                  // onChange={(event) => handleChangeQuantity(event, index)}
                  sx={{ maxWidth: { md: 100 } }}
                />
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
              label="PR Approver"
            >
              {systemUsersList.map((option) => (
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
      </Stack>

      <Stack spacing={2} sx={{ pt: 2 }}>
        <Stack>
          {values?.messages?.map((item, index) => {
            return (
              <Comment
                key={index}
                name={item.userName}
                message={item.message}
                postedAt={item.postedAt}
              />
            );
          })}
        </Stack>

        <RHFTextField
          name="correctionComment"
          label="Comment"
          multiline
          rows={3}
        />
      </Stack>
    </Box>
  );
}
