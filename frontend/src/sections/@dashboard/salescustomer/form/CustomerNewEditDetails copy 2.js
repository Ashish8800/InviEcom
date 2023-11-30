import sum from "lodash/sum";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// form
import { useFieldArray, useFormContext } from "react-hook-form";
import { useSettingsContext } from "src/components/settings";
// @mui
import {
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";

import Scrollbar from "src/components/scrollbar";
// utils
import { fData } from "../../../../utils/formatNumber";
// components
import Iconify from "src/components/iconify";
import { RHFCheckbox, RHFUploadAvatar } from "../../../../components/hook-form";

import { PATH_DASHBOARD } from "src/routes/paths";
// _mock_
import { CardContent, CardHeader } from "@mui/material";
import PropTypes from "prop-types";
import { _userList } from "src/_mock/arrays";

import FormProvider from "src/components/hook-form/FormProvider";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from "src/components/table";
import EditDeliveryDetails from "src/sections/@dashboard/salescustomer/form/EditDeliveryDetails.js";
import CustomerTableRow1 from "src/sections/@dashboard/salescustomer/list/CustomerTableRow1.js";

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  { id: 1, name: "full stack development", price: 90.99 },
  { id: 2, name: "backend development", price: 80.99 },
  { id: 3, name: "ui design", price: 70.99 },
  { id: 4, name: "ui/ux design", price: 60.99 },
  { id: 5, name: "front end development", price: 40.99 },
];
const PAYMENT_MODE = ["gapy", "credit card", "debit card"];
const Vendor = ["RIYA", "SHREYA", "DIVYA"];
const PURCHASE_NUMBER = ["100234", "00983", "007654"];

const STATUS_OPTIONS = ["Active", "Inactive"];

const TABLE_HEAD = [
  { id: "orderID", label: " Order ID", align: "center" },
  { id: "date", label: " Order Date", align: "center" },
  { id: "product", label: "Products", align: "center" },
  { id: "orderAmount", label: "Total Order Amount", align: "center" },
  { id: "paymentStatus", label: "Payment Status", align: "center" },
  { id: "transactionId", label: "Transaction ID", align: "center" },
  { id: "deliveryStatus", label: "Delivery Status", align: "center" },
];

// ----------------------------------------------------------------------
ReceiveNewEditDetails.propTypes = {
  billing: PropTypes.object,
  onBackStep: PropTypes.func,
};

export default function ReceiveNewEditDetails({ billing, onBackStep }) {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [categoryOpen, setCategoryOpen] = useState(false);

  const handleCategoryOpen = () => {
    setCategoryOpen(true);
  };

  const handleCategoryClose = () => {
    setCategoryOpen(false);
  };

  const [subCategoryOpen, setSubCategoryOpen] = useState(false);

  const handleSubCategoryOpen = () => {
    setSubCategoryOpen(true);
  };

  const handleSubCategoryClose = () => {
    setSubCategoryOpen(false);
  };
  const [manufacturerOpen, setManufacturerOpen] = useState(false);

  const handleManufacturerOpen = () => {
    setManufacturerOpen(true);
  };

  const handleManufacturerClose = () => {
    setManufacturerOpen(false);
  };

  const values = watch();

  const totalOnRow = values.items.map((item) => item.quantity * item.price);

  const totalPrice = sum(totalOnRow) - values.discount + values.taxes;

  useEffect(() => {
    setValue("totalPrice", totalPrice);
  }, [setValue, totalPrice]);

  const handleAdd = () => {
    append({
      title: "",
      description: "",
      service: "",
      quantity: 1,
      price: 0,
      total: 0,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index) => {
      resetField(`items[${index}].quantity`);
      resetField(`items[${index}].price`);
      resetField(`items[${index}].total`);
    },
    [resetField]
  );

  const handleSelectService = useCallback(
    (index, option) => {
      setValue(
        `items[${index}].price`,
        SERVICE_OPTIONS.find((service) => service.name === option)?.price
      );
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

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

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("cover", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = () => {
    setValue("cover", null);
  };

  // ===================================================================================

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState(_userList);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [deliveryFormData, setDeliveryFormData] = useState();

  const handleDeliveryOpen = () => {
    setDeliveryOpen(true);
  };

  const handleDeliveryClose = () => {
    setDeliveryOpen(false);
  };

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const methods = useForm({});

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    // Api.post(apiUrls.website.contact, data)
    //   .then((res) => {
    //     enqueueSnackbar("Contact created successfully");
    //     reset({
    //       ...defaultValues,
    //     });
    //     setPhoneNumber("");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     enqueueSnackbar(err.message, { variant: "error" });
    //   });
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
  });

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const denseHeight = dense ? 52 : 72;

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  // const handleEditRow = (id) => {
  //   setDeliveryOpen(true);
  //   setDeliveryFormData({});

  // };

  const handleSaveAsDraft = async (data) => {
    reset();
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.purchase.request.root);
  };

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      setLoadingSend(false);
      navigate(PATH_DASHBOARD.purchase.request.root);
      console.log("DATA", JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setLoadingSend(false);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Stack sx={{ pt: 4, px: 3 }}>
            <Stack direction="row">
              <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                Customer ID:
              </Typography>
              <Typography>183456</Typography>
            </Stack>
            <Stack direction="row">
              <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                Customer Name:
              </Typography>
              <Typography>shruti yadav</Typography>
            </Stack>
            <Stack direction="row">
              <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                Date:
              </Typography>
              <Typography>19/04/23</Typography>
            </Stack>
            <Stack direction="row">
              <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                Contact Number:
              </Typography>
              <Typography>987654321</Typography>
            </Stack>

            <Stack>
              <Stack sx={{ pb: 2, pt: 2 }}>
                <Typography variant="h6">Billing Address</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Address:
                </Typography>
                <Typography>Lucknow</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  City:
                </Typography>
                <Typography>Lucknow</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  State:
                </Typography>
                <Typography>UTTAR PRADESH</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Country:
                </Typography>
                <Typography>India</Typography>
              </Stack>
            </Stack>
            <Stack
              display="flex"
              direction="row"
              alignItems="center"
              spacing={2}
            >
              <Typography variant="h6">Access:</Typography>
              <RHFCheckbox name="sales" label="Active" />
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack sx={{ p: 2 }} spacing={1}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: "auto",
                    display: "block",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
            <Card>
              <CardHeader
                title=" Delivery Address"
                action={
                  <Button
                    size="small"
                    startIcon={<Iconify icon="eva:edit-fill" />}
                    onClick={handleDeliveryOpen}
                  >
                    Edit
                  </Button>
                }
              />
              <EditDeliveryDetails
                open={deliveryOpen}
                data={deliveryFormData}
                onClose={handleDeliveryClose}
              />

              <CardContent>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Address:
                  </Typography>
                  <Typography>Lucknow</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    City:
                  </Typography>
                  <Typography>Lucknow</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    State:
                  </Typography>
                  <Typography>UTTAR PRADESH</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Country:
                  </Typography>
                  <Typography>India</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
      <Card sx={{ p: 3 }}>
        <Stack>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Stack sx={{ p: 2 }}>
                <Typography variant="h6">Products</Typography>
              </Stack>
              <Divider />

              <TableContainer sx={{ position: "relative", overflow: "unset" }}>
                <TableSelectedAction
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  action={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={handleOpenConfirm}>
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    </Tooltip>
                  }
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
                      onSelectAllRows={false}
                    />

                    <TableBody>
                      {dataFiltered
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => (
                          <CustomerTableRow1
                            key={row.id}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            // onEditRow={() => handleEditRow(row.name)}
                          />
                        ))}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(
                          page,
                          rowsPerPage,
                          tableData.length
                        )}
                      />

                      <TableNoData isNotFound={isNotFound} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
              <Divider />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </FormProvider>
  );
}

// =============================================================================

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
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
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== "all") {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== "all") {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
