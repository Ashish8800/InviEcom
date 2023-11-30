import { useEffect, useState } from "react";
// form
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

// @mui
import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import PropTypes from "prop-types";
// utils
// components

// _mock_

import { TableNoData } from "src/components/table";

import { DatePicker } from "@mui/x-date-pickers";
import { useCallback } from "react";
import ConfirmDialog from "src/components/confirm-dialog/ConfirmDialog";
import {
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Iconify from "src/components/iconify/Iconify";
import { Upload } from "src/components/upload";
import RFQ from "src/controller/purchase/RFQ.controller";
import Currency from "src/controller/settings/Currency.controller";
import AddComponent from "src/sections/@dashboard/purchase/quotation/form/AddComponent";

const TABLE_HEAD = [
  "Components",
  "Req. Quantity",
  "Part Number",
  "Quoted Quantity",
  "Quote Unit Price $*",
  "Extended Price $*",
  "Quote Lead Time",
  "Action",
];

// ----------------------------------------------------------------------
QuotationNewEditDetails.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object,
  onDeleteRow: PropTypes.func,
  isEdit: PropTypes.func,
  onCreate: PropTypes.func,
};

export default function QuotationNewEditDetails({ isEdit }) {
  // Dialog states
  const [
    addQuotationComponentDialogState,
    setAddQuotationComponentDialogState,
  ] = useState(false);

  const [idForDelete, setIdForDelete] = useState("");

  const [rfqList, setRFQList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);

  const [rfq, setRFQ] = useState({});
  const [rfqItems, setRFQItems] = useState([]);
  const [vendorData, setVendorData] = useState({});

  const [preview, setPreview] = useState(false);
  const [files, setFiles] = useState([]);

  const {
    setValue,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const { append: itemAppend } = useFieldArray({
    control,
    name: "items",
  });

  const {
    fields: paymentEventsFields,
    append: paymentEventAppend,
    remove: paymentEventRemove,
  } = useFieldArray({
    control,
    name: "paymentTermsEvents",
  });

  const values = watch();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = (id) => {
    setOpenConfirm(true);
    setIdForDelete(id);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleDropFile = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setPreview(true);
      setFiles([...files, ...newFiles]);
      setValue("quotationFiles", [...files, ...newFiles]);
    },
    [files]
  );

  const handleRemoveFiles = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
    setValue("quotationFiles", filtered);
  };

  const handleAddComponentOpen = () => {
    setAddQuotationComponentDialogState(true);
  };

  const handleAddComponentClose = () => {
    setAddQuotationComponentDialogState(false);
  };

  const handleAddComponent = (data) => {
    const list = rfqItems.filter((item) => item.ipn !== data.ipn);
    setRFQItems(list);
    itemAppend(data);
    setAddQuotationComponentDialogState(false);
  };

  const handleDeleteRow = () => {
    if (idForDelete) {
      // Add deleted item to rfqItems list
      const item = rfq?.items?.filter((item) => item.ipn === idForDelete);
      setRFQItems([...rfqItems, ...item]);
      const data = values?.items?.filter((item) => item.ipn != idForDelete);
      setValue("items", data);
      handleCloseConfirm();
    }
  };

  useEffect(() => {
    RFQ.list("?status=send_to_vendor")
      .then((res) => setRFQList(res))
      .catch((error) => console.log(error));

    Currency.list().then((data) => {
      setCurrencyList(data);
    });
  }, []);

  useEffect(() => {
    RFQ.list()
      .then((res) => setRFQList(res))
      .catch((error) => console.log(error));
  }, [isEdit]);

  useEffect(() => {
    if (values.rfqId) {
      rfqList?.forEach((item) => {
        if (item.id == values.rfqId) {
          setRFQ(item ?? {});
          setVendorData(item.vendor ?? {});
          setRFQItems(item.items);
        }
      });
    }
  }, [values.rfqId, rfqList]);

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Stack sx={{ mt: 2 }}>
          <Box
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
            mb={2}
          >
            <RHFSelect size="small" name="rfqId" label="RFQ Number">
              {rfqList?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.id}
                </MenuItem>
              ))}
            </RHFSelect>
          </Box>

          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Vendor Name:
            </Typography>
            <Typography>{vendorData?.vendorDisplayName}</Typography>
          </Stack>
          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Vendor Address:
            </Typography>
            <Typography>{`${vendorData?.billing?.address ?? ""} ${
              vendorData?.billing?.city ?? ""
            } ${vendorData?.billing?.state ?? ""} ${
              vendorData?.billing?.country ?? ""
            } ${vendorData?.billing?.pincode ?? ""} `}</Typography>
          </Stack>
          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              PR Number:
            </Typography>
            <Typography variant="h6">{rfq?.prRequestId}</Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 1 }} />

        <Box
          rowGap={2}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
        >
          <Stack sx={{ mt: 2, mb: 2, gridColumn: "-1/1" }}>
            <Typography variant="h6">Quotation Details</Typography>
          </Stack>

          <Stack direction="column" spacing={2}>
            <RHFTextField
              size="small"
              name="venderQuotationId"
              label="Vendor Quotation Number"
            />

            <Controller
              name="quotationDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Quotation Date"
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
            <RHFTextField
              size="small"
              name="quotationValidity"
              label="Quotation Validity"
            />
            <RHFSelect size="small" name="quotationCurrency" label="Currency">
              {currencyList?.map((option, i) => {
                return (
                  <MenuItem key={i} value={option.name}>
                    {option.name} ({option.symbol})
                  </MenuItem>
                );
              })}
            </RHFSelect>
          </Stack>
          <Stack spacing={1}>
            <Upload
              size="small"
              multiple
              files={files}
              thumbnail={preview}
              onDrop={handleDropFile}
              onRemove={handleRemoveFiles}
            />
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Stack
            sx={{ py: 2 }}
            display="flex"
            direction="row"
            justifyContent="space-between"
          >
            <Stack>
              <Typography variant="h6">Quotation Components</Typography>
            </Stack>

            <Stack>
              {rfqItems.length > 0 && (
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={handleAddComponentOpen}
                >
                  Component
                </Button>
              )}
            </Stack>
          </Stack>

          <TableContainer>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              size="small"
            >
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map((item) => (
                    <TableCell key={item}>{item}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {values?.items?.map((row) => (
                  <TableRow hover>
                    <TableCell align="left">{row?.ipn}</TableCell>
                    <TableCell align="left">{row?.requestedQty}</TableCell>
                    <TableCell align="left">{row?.partNo}</TableCell>
                    <TableCell align="left">{row?.quotedQuantity}</TableCell>
                    <TableCell align="left">{row?.quotedUnitPrice}</TableCell>
                    <TableCell align="left">-</TableCell>
                    <TableCell align="left">{row?.quotedLeadTime}</TableCell>
                    <TableCell align="left">
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        onClick={() => {
                          handleOpenConfirm(row.ipn);
                          handleClosePopover();
                        }}
                      ></Button>
                    </TableCell>
                  </TableRow>
                ))}

                <ConfirmDialog
                  open={openConfirm}
                  onClose={handleCloseConfirm}
                  title="Delete"
                  content="Are you sure want to delete?"
                  action={
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteRow()}
                    >
                      Delete
                    </Button>
                  }
                />

                <TableNoData
                  isNotFound={values?.items?.length == 0}
                  title="Haven't selected any component yet."
                />
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Grid container>
          <Grid item xs={12} md={6}>
            <Stack spacing={1} sx={{ pb: 3, p: 2 }}>
              <Stack direction="column">
                <Typography paragraph sx={{ pr: 2, pt: 1 }}>
                  Payment Terms :
                </Typography>
                <RHFRadioGroup
                  name="paymentTerm"
                  options={[
                    { label: "Full Payment", value: "fullPayment" },
                    { label: "Partial", value: "partial" },
                  ]}
                />
              </Stack>

              {values.paymentTerm == "partial" && (
                <>
                  <Stack
                    divider={
                      <Divider flexItem sx={{ borderStyle: "dashed" }} />
                    }
                    spacing={1}
                  >
                    {paymentEventsFields.map((item, index) => {
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
                            <RHFTextField
                              size="small"
                              type="string"
                              name={`paymentTermsEvents[${index}].event`}
                              label="Event"
                              // sx={{ maxWidth: { md: 150 } }}
                            />
                            <RHFTextField
                              size="small"
                              type="string"
                              name={`paymentTermsEvents[${index}].amount`}
                              label="Amount (%)"
                              // sx={{ maxWidth: { md: 150 } }}
                            />

                            <Button
                              size="small"
                              color="error"
                              startIcon={<Iconify icon="eva:trash-2-outline" />}
                              onClick={() => paymentEventRemove(index)}
                              sx={{ paddingX: 3 }}
                            ></Button>
                          </Stack>
                        </Stack>
                      );
                    })}
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
                      onClick={() => {
                        paymentEventAppend({
                          event: "",
                          amount: "",
                        });
                      }}
                      sx={{ flexShrink: 0 }}
                    >
                      Event
                    </Button>
                  </Stack>
                </>
              )}
            </Stack>

            <Stack sx={{ mt: 4, mb: 2 }}>
              <Typography>* All prices are excluding Taxes</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Add component dialog */}
      <AddComponent
        open={addQuotationComponentDialogState}
        onClose={handleAddComponentClose}
        onAdd={handleAddComponent}
        list={rfqItems}
      />
    </>
  );
}
