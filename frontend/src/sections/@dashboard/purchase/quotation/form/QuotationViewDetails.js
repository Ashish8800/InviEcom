import { useEffect, useState } from "react";
// form
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

// @mui
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

import Scrollbar from "src/components/scrollbar";
// utils
// components

// _mock_

import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  getComparator,
  useTable,
} from "src/components/table";

import { DatePicker } from "@mui/x-date-pickers";
import { useCallback } from "react";
import {
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Iconify from "src/components/iconify/Iconify";
import { Upload } from "src/components/upload";
import RFQ from "src/controller/purchase/RFQ.controller";
import Currency from "src/controller/settings/Currency.controller";
import AddComponentForm from "src/pages/dashboard/inventry/AddInventryComponentDialog";
import { QuotationTableToolbar2 } from "src/sections/@dashboard/purchase/quotation/list";

const TABLE_HEAD = [
  // { id: "", label: "", align: "left" },
  { id: "components", label: "Components", align: "left" },
  { id: "requestedQty", label: "Req. Quantity", align: "left" },
  { id: "partNumber", label: "Part Number", align: "left" },
  { id: "quotedQuantity", label: "Quoted Quantity", align: "left" },
  { id: "unitPrice", label: "Quote Unit Price $*", align: "left" },
  { id: "extendedPrice", label: "Extended Price $*", align: "left" },
  { id: "leadTime", label: "Quote Lead Time", align: "left" },
];

// ----------------------------------------------------------------------
QuotationViewDetails.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object,
  onCreate: PropTypes.func,
  isEdit: PropTypes.func,
};
export default function QuotationViewDetails({
  data,
  onCreate,
  title,
  isEdit,
}) {
  const [rfqList, setRFQList] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [currencyList, setCurrencyList] = useState([]);

  const [vendorData, setVendorData] = useState({});
  const [rfq, setRFQ] = useState({});
  const [rfqItems, setRFQItems] = useState([]);

  const [filterName, setFilterName] = useState("");
  const [requestDetails, setRequestDetails] = useState("");

  const [filterRole, setFilterRole] = useState("all");
  const [preview, setPreview] = useState(false);
  const [files, setFiles] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  const {
    dense,
    order,
    orderBy,
    page,
    rowsPerPage,
    onChangeDense,
    onChangeRowsPerPage,
    onChangePage,
    setPage,
    onSelectRow,
    onSelectAllRows,
    //
    selected,
    //
    onSort,
  } = useTable();

  const { setValue, control, watch } = useFormContext();

  const {
    fields: itemFields,
    append: itemAppend,
    remove: itemRemove,
  } = useFieldArray({
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

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleFilterName = (event) => {
    setPage(0);
    console.log(event);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };
  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
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
          resetAddComponentInQuotationForm();
        }
      });
    }
  }, [values.rfqId, rfqList]);

  useEffect(() => {
    if (values.ipn) {
      rfqItems?.forEach((item) => {
        if (item.ipn == values.ipn) {
          setValue("requestedQty", item.quantity);
          setValue("partNo", item.mpn);
        }
      });
    }
  }, [values.ipn]);

  const handleAddComponentInQuotation = () => {
    let tempItem = {
      ipn: values.ipn,
      itemType: values.itemType,
      suggestedIpn: values.suggestedIpn,
      requestedQty: values.requestedQty,
      quotedQuantity: values.quotedQuantity,
      partNo: values.partNo,
      minimumQuantity: values.minimumQuantity,
      quotedLeadTime: values.quotedLeadTime,
      quotedUnitPrice: values.quotedUnitPrice,
    };

    itemAppend(tempItem);
    resetAddComponentInQuotationForm();
  };

  function resetAddComponentInQuotationForm() {
    setValue("ipn", "");
    setValue("itemType", "original");
    setValue("suggestedIpn", "");
    setValue("requestedQty", "");
    setValue("quotedQuantity", "");
    setValue("partNo", "");
    setValue("minimumQuantity", "");
    setValue("quotedLeadTime", "");
    setValue("quotedUnitPrice", "");
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box>
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
            <RHFSelect
              disabled={true}
              size="small"
              name="rfqId"
              label="RFQ Number"
            >
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
      </Box>

      <Divider sx={{ my: 2 }} />

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
            disabled={true}
            size="small"
            name="venderQuotationId"
            label="Vendor Quotation Number"
          />
          <Controller
            name="quotationDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                disabled={true}
                label="Quotation Date"
                inputFormat="dd/MM/yyyy"
                value={field.value}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    disabled={true}
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
            disabled={true}
            size="small"
            name="quotationValidity"
            label="Quotation Validity"
          />
          <RHFSelect
            disabled={true}
            size="small"
            name="quotationCurrency"
            label="Currency"
          >
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
            disabled={true}
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
        <Stack sx={{ mt: 2, mb: 2 }}>
          <Typography variant="h6">Add Component In Quote</Typography>
        </Stack>
        <Box
          rowGap={2}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
        >
          <RHFSelect
            disabled={true}
            size="small"
            fullWidth
            name="ipn"
            label="IPN"
          >
            {rfqItems?.map((option, index) => (
              <MenuItem key={option.ipn} value={option.ipn}>
                {option.ipn}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFRadioGroup
            disabled={true}
            row
            spacing={2}
            name="itemType"
            options={[
              {
                label: "Original Component",
                disabled: true,
                value: "original",
              },
              {
                label: "Suggestive Component",
                disabled: true,
                value: "suggestive",
              },
            ]}
          />
          <Typography></Typography>

          {values.itemType === "suggestive" && (
            <Stack>
              <RHFSelect
                disabled={true}
                size="small"
                fullWidth
                name="suggestedIpn"
                label="Search for existing components..."
              >
                {rfqList?.map((option, index) => (
                  <MenuItem key={option.id + option.name} value={option.id}>
                    {option.vendorDisplayName}
                  </MenuItem>
                ))}
                <Button
                  disabled={true}
                  fullWidth
                  variant="contained"
                  size="small"
                  sx={{ marginTop: 1 }}
                  onClick={() => {}}
                >
                  Add New Components
                </Button>
              </RHFSelect>
              <AddComponentForm open={false} onClose={() => {}} />
            </Stack>
          )}

          <Divider sx={{ gridColumn: "-1/1" }} />

          <TextField
            disabled={true}
            value={values.requestedQty}
            size="small"
            label="Requested Quantity"
          />

          <RHFTextField
            disabled={true}
            size="small"
            name="quotedQuantity"
            label="Quoted Quantity"
          />
          <RHFTextField
            disabled={true}
            size="small"
            name="partNo"
            label="Part No."
          />
          <RHFTextField
            disabled={true}
            size="small"
            name="minimumQuantity"
            label="Minimum Quantity"
          />
          <RHFTextField
            disabled={true}
            size="small"
            name="quotedLeadTime"
            label="Quoted Lead Time"
          />
          <RHFTextField
            disabled={true}
            size="small"
            name="quotedUnitPrice"
            label="Quoted Unit Price"
          />
        </Box>
        <Stack justifyContent="flex-end" direction="row" sx={{ mb: 2 }}>
          <Button
            disabled={true}
            type="button"
            variant="contained"
            size="small"
            sx={{ marginTop: 1 }}
            onClick={handleAddComponentInQuotation}
          >
            Add Component In Quotation
          </Button>
        </Stack>
      </Box>

      <Card sx={{ p: 2 }}>
        <Stack>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Stack sx={{ p: 2 }}>
                <Typography variant="h6"> Quotation Components</Typography>
              </Stack>
              <Divider />
              <QuotationTableToolbar2
                onFilterName={handleFilterName}
                onFilterRole={handleFilterRole}
                onResetFilter={handleResetFilter}
              />

              <TableContainer sx={{ position: "relative", overflow: "unset" }}>
                <TableSelectedAction
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.id)
                  //   )
                  // }
                />
                <Scrollbar>
                  <Table
                    size={dense ? "small" : "medium"}
                    sx={{ minWidth: 800 }}
                  >
                    <TableHeadCustom
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={tableData.length}
                      numSelected={selected.length}
                      onSort={onSort}
                    />

                    <TableBody>
                      {values.items.map((row, index) => (
                        <TableRow hover selected={selected}>
                          <TableCell align="left">{row?.ipn}</TableCell>
                          <TableCell align="left">
                            {row?.requestedQty}
                          </TableCell>
                          <TableCell align="left">{row?.partNo}</TableCell>
                          <TableCell align="left">
                            {row?.quotedQuantity}
                          </TableCell>
                          <TableCell align="left">
                            {row?.quotedUnitPrice}
                          </TableCell>
                          <TableCell align="left">-</TableCell>
                          <TableCell align="left">
                            {row?.quotedLeadTime}
                          </TableCell>
                        </TableRow>
                      ))}

                      <TableNoData isNotFound={values.items.length == 0} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
              <TablePaginationCustom
                count={dataFiltered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                //
                dense={dense}
                onChangeDense={onChangeDense}
              />
              {/* <Typography color="error">
                {" "}
                {formState.errors.items?.message ?? ""}
              </Typography> */}
            </Grid>
          </Grid>
        </Stack>
      </Card>

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
                  {
                    label: "Full Payment",
                    value: "fullPayment",
                    disabled: true,
                  },
                  { label: "Partial", value: "partial", disabled: true },
                ]}
              />
            </Stack>

            {values.paymentTerm == "partial" && (
              <>
                <Stack
                  divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
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
                            disabled={true}
                            size="small"
                            type="string"
                            name={`paymentTermsEvents[${index}].event`}
                            label="Event"
                            // sx={{ maxWidth: { md: 150 } }}
                          />
                          <RHFTextField
                            disabled={true}
                            size="small"
                            type="string"
                            name={`paymentTermsEvents[${index}].amount`}
                            label="Amount (%)"
                            // sx={{ maxWidth: { md: 150 } }}
                          />
                          <Button
                            disabled={true}
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
                    disabled={true}
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
  );
}
// =================================================================

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterService,
  filterStartDate,
  filterEndDate,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (invoice) =>
        invoice.invoiceNumber
          .toLowerCase()
          .indexOf(filterName.toLowerCase()) !== -1 ||
        invoice.invoiceTo.name
          .toLowerCase()
          .indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
