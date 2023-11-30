import sum from "lodash/sum";
import PropTypes from "prop-types";

import { useEffect, useState } from "react";
// form
import { useFieldArray, useFormContext } from "react-hook-form";
import { useSettingsContext } from "src/components/settings";
// @mui
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import Scrollbar from "src/components/scrollbar";
// utils
import { fCurrency } from "../../../../../utils/formatNumber";
// components
import Iconify from "src/components/iconify";
import { RHFSelect } from "../../../../../components/hook-form";

// _mock_

import Image from "src/components/image/Image";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from "src/components/table";
import PurchaseRequest from "src/controller/purchase/PurchaseRequest.controller";
import Vendor from "src/controller/purchase/Vendor.controller";
import User from "src/controller/userManagement/User.controller";
import OrderCretaeTableRow1 from "src/sections/@dashboard/purchase/order/list/OrderCreateTableRow1";

// ----------------------------------------------------------------------
const StyledRowResult = styled(TableRow)(({ theme }) => ({
  "& td": {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const TABLE_HEAD = [
  { id: "select", label: " Select", align: "left" },
  { id: "vendorName", label: "Vendor Name", align: "left" },
  { id: "quantity", label: " Available Quantity", align: "left" },
  { id: "quotePrice", label: "Quote Price", align: "left" },
  { id: "leadTime", label: "Quoted Lead Time", align: "left" },
];

// ----------------------------------------------------------------------
OrderNewEditDetails.propTypes = {
  invoice: PropTypes.object,
};

export default function OrderNewEditDetails(invoice) {
  const { control, setValue, watch } = useFormContext();

  const [vendorList, setVendorList] = useState([]);
  const [purchaseRequestList, setPurchaseRequestList] = useState([]);
  const [purchaseApproverLIst, setPurchaseApproverLIst] = useState([]);
  const [purchaseRequest, setPurchaseRequest] = useState({});
  const [vendorData, setVendorData] = useState({});

  const { append } = useFieldArray({
    control,
    name: "items",
  });

  const values = watch();

  const totalOnRow = values.items?.map((item) => item.quantity * item.price);

  const totalPrice = sum(totalOnRow) - values.discount + values.taxes;

  useEffect(() => {
    setValue("totalPrice", totalPrice);
  }, [setValue, totalPrice]);

  // ===================================================================================

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectAllRows,
    //
    onSort,
  } = useTable();

  const {
    items,
    taxes,
    status,
    dueDate,
    discount,
    invoiceTo,
    createDate,
    invoiceFrom,
    invoiceNumber,
    subTotalPrice,
  } = invoice;

  const { themeStretch } = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [tableTotal, setTableTotal] = useState({});

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");
  const [warehouseOpen, setWarehouseOpen] = useState(false);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  useEffect(() => {
    PurchaseRequest.list("?status=approved").then((res) => {
      setPurchaseRequestList(res);
      if (values.purchaseRequest != "") {
        res.forEach((item) => {
          if (item.id == values.purchaseRequest) {
            setPurchaseRequest(item);
            setTableData(item.items ?? []);
          }
        });
      }
    });
    Vendor.list().then((res) => {
      setVendorList(res);
      if (values.vendor != "") {
        res.forEach((item) => {
          if (item.id == values.vendor) {
            setVendorData(item);
          }
        });
      }
    });
    User.list().then((res) => setPurchaseApproverLIst(res));
  }, []);

  useEffect(() => {
    let table = [];
    tableData.forEach((item) => {
      table.push(item.quantity * item.price);
    });

    setTableTotal({
      subtotal: sum(table),
      discount: 0,
      taxes: 0,
      total: sum(table),
    });
  }, [tableData]);

  useEffect(() => {
    if (purchaseRequestList.length > 0) {
      purchaseRequestList.forEach((item) => {
        if (item.id == values.purchaseRequest) {
          setPurchaseRequest(item);
          setTableData(item.items ?? []);
        }
      });
    }
  }, [values.purchaseRequest]);

  useEffect(() => {
    if (vendorList.length > 0) {
      vendorList.forEach((item) => {
        if (item.id == values.vendor) {
          setVendorData(item);
        }
      });
    }
  }, [values.vendor]);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={4}>
        <Stack sx={{ pb: 2 }} spacing={2}>
          <RHFSelect
            small
            name="purchaseRequest"
            label="PR Number"
            size="small"
          >
            {purchaseRequestList?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.title}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>

        <Card sx={{ p: 2 }}>
          <Stack sx={{ pb: 2 }} spacing={2}>
            <RHFSelect
              small
              name="purchaseRequest"
              label="PR Number"
              size="small"
            >
              {purchaseRequestList?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.title}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h6">Add Item In PO</Typography>

            <RHFSelect small name="itemList" label="Item" size="small">
              {purchaseRequestList?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.title}
                </MenuItem>
              ))}
            </RHFSelect>
            <Stack direction="row">
              <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                Requested Quantity:
              </Typography>
              <Typography>100</Typography>
            </Stack>
          </Stack>
          <Stack>
            <TableContainer sx={{ position: "relative", overflow: "unset" }}>
              <TableSelectedAction
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData?.map((row) => row.id)
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
                <Table size={dense ? "small" : "medium"} sx={{ minWidth: 800 }}>
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
                    {tableData?.map((row, index) => (
                      <OrderCretaeTableRow1
                        key={row.id}
                        row={row}
                        index={index}
                        selected={selected.includes(row.id)}
                      />
                    ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                    />

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
            <Divider />
          </Stack>
          <Grid container display="flex" justifyContent="space-between">
            <Grid item xs={12} sm={3} md={6} sx={{ m: 1 }}>
              <Stack>
                <RHFSelect
                  small
                  name="purchaseRequest"
                  label="PO Verifier"
                  size="small"
                >
                  {purchaseRequestList?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.title}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={3} md={3} sx={{ m: 1 }}>
              <Stack direction="row" display="flex" justifyContent="flex-end">
                <Button size="medium" variant="contained">
                  Add Item For PO
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item md={8}>
        <Card sx={{ pt: 5, px: 2 }}>
          <Grid container justifyContent="space-between">
            <Grid item xs={4} md={4}>
              <Stack spacing={2} direction="row">
                <Stack>
                  <Image
                    fullWidth
                    disabledEffect
                    alt="logo"
                    src="/logo/Logo_Full-01.svg"
                    sx={{ maxWidth: 120 }}
                  />
                </Stack>
              </Stack>
              <Stack spacing={2} sx={{ pt: 2 }}>
                <Stack>
                  <Typography
                    paragraph
                    variant="subtitle1"
                    sx={{ color: "text.disabled" }}
                  >
                    Invoice to
                  </Typography>

                  <Typography variant="subtitle2">
                    Inevitable Electronics Pvt Ltd
                  </Typography>

                  <Typography variant="body2">
                    482, 10th Main, 40th Cross Rd, 5th Block
                  </Typography>
                  <Typography variant="body2">
                    Jayanagar, Bengaluru, Karnataka 560041
                  </Typography>

                  <Typography variant="body2">Phone: 234567890-</Typography>
                  <Typography variant="body2">
                    Email: contact@inevitableelectronics.com-
                  </Typography>
                </Stack>
              </Stack>
              <Stack spacing={2} sx={{ pt: 2 }}>
                <Stack>
                  <Typography
                    paragraph
                    variant="subtitle1"
                    sx={{ color: "text.disabled" }}
                  >
                    Dispatched to
                  </Typography>

                  <Typography variant="subtitle2">
                    Inevitable Electronics Pvt Ltd
                  </Typography>

                  <Typography variant="body2">
                    482, 10th Main, 40th Cross Rd, 5th Block
                  </Typography>
                  <Typography variant="body2">
                    Jayanagar, Bengaluru, Karnataka 560041
                  </Typography>

                  <Typography variant="body2">Phone: 234567890-</Typography>
                  <Typography variant="body2">
                    Email: contact@inevitableelectronics.com
                  </Typography>
                  <Typography variant="body2">
                    GSTIN/UN:345ERTY34567445D
                  </Typography>
                  <Typography variant="body2">
                    State Name : Karnataka
                  </Typography>
                  <Typography variant="body2">Code : 234567</Typography>
                </Stack>
              </Stack>
              <Stack spacing={2} sx={{ pt: 2 }}>
                <Stack>
                  <Typography
                    paragraph
                    variant="subtitle1"
                    sx={{ color: "text.disabled" }}
                  >
                    Supplier
                  </Typography>

                  <Typography variant="subtitle2">
                    HI-Q Electronics Pvt Ltd
                  </Typography>

                  <Typography variant="body2">
                    9 ,Industrial State Hosur
                  </Typography>
                  <Typography variant="body2">
                    GSTIN/UN:345ERTY34567445D
                  </Typography>
                  <Typography variant="body2">
                    State Name : Tamil Nadu
                  </Typography>
                  <Typography variant="body2">Phone: 234567890-</Typography>
                  <Typography variant="body2">
                    Email: contact@inevitableelectronics.com-
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={4} md={4}>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  Dated :
                </Typography>

                <Typography variant="body2">18-6-2023</Typography>
              </Stack>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  Voucher No:
                </Typography>

                <Typography variant="body2">INVELEP/PO/18-1-23</Typography>
              </Stack>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  Suppler'sRef/Ord No.:
                </Typography>

                <Typography variant="body2">INVELEP/PO/0987654</Typography>
              </Stack>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  Other Reference(s):
                </Typography>

                <Typography variant="body2">12345SD#$XGF</Typography>
              </Stack>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  Mode/Term of Payment:
                </Typography>

                <Typography variant="body2">Online</Typography>
              </Stack>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  Dispatch Through:
                </Typography>

                <Typography variant="body2">--</Typography>
              </Stack>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  Destination:
                </Typography>

                <Typography variant="body2">--</Typography>
              </Stack>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  City/Port of Loading:
                </Typography>

                <Typography variant="body2">---</Typography>
              </Stack>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  City/Port of Discharged:
                </Typography>

                <Typography variant="body2">---</Typography>
              </Stack>
            </Grid>
          </Grid>

          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead
                  sx={{
                    borderBottom: (theme) =>
                      `solid 1px ${theme.palette.divider}`,
                    "& th": { backgroundColor: "transparent" },
                  }}
                >
                  <TableRow>
                    <TableCell align="left" width={40}>
                      Sr.No
                    </TableCell>

                    <TableCell align="left">Description of Goods</TableCell>

                    <TableCell align="left">HSN/SAC</TableCell>
                    <TableCell align="left">Quantity</TableCell>
                    <TableCell align="left">Rate</TableCell>

                    <TableCell align="left">Per</TableCell>

                    <TableCell align="left">Amount</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        borderBottom: (theme) =>
                          `solid 1px ${theme.palette.divider}`,
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>

                      <TableCell align="left">
                        <Box sx={{ maxWidth: 560 }}>
                          <Typography variant="subtitle2">
                            {row.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                            noWrap
                          >
                            {row.description}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="left">{row.quantity}</TableCell>

                      <TableCell align="left">{fCurrency(row.price)}</TableCell>

                      <TableCell align="left">
                        {fCurrency(row.price * row.quantity)}
                      </TableCell>
                      <TableCell align="left">
                        {fCurrency(row.price * row.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}

                  <StyledRowResult>
                    <TableCell colSpan={5} />

                    <TableCell align="left" sx={{ typography: "body1" }}>
                      <Box sx={{ mt: 2 }} />
                      Subtotal
                    </TableCell>

                    <TableCell
                      align="left"
                      width={120}
                      sx={{ typography: "body1" }}
                    >
                      <Box sx={{ mt: 2 }} />
                      {fCurrency(1000)}
                    </TableCell>
                  </StyledRowResult>

                  <StyledRowResult>
                    <TableCell colSpan={5} />

                    <TableCell align="left" sx={{ typography: "h6" }}>
                      Total
                    </TableCell>

                    <TableCell
                      align="left"
                      width={140}
                      sx={{ typography: "h6" }}
                    >
                      {fCurrency(100000)}
                    </TableCell>
                  </StyledRowResult>
                </TableBody>
              </Table>
            </Scrollbar>
            <Divider sx={{ mt: 1 }} />
            <Stack>
              <Typography variant="subtitle2">
                Amount Chargeable (in words){" "}
              </Typography>

              <Typography variant="body2">
                INR Two Lakh Eighty Seven thousand rupees
              </Typography>
              <Typography variant="body2">
                Fifteen and Thirty Paise only
              </Typography>
            </Stack>
          </TableContainer>

          <Grid container sx={{ pt: 10 }}>
            <Grid item xs={12} md={9} sx={{ py: 3 }}>
              <Typography variant="subtitle2"> Company's PAN:</Typography>

              <Typography variant="body2">AXNP22645L</Typography>
            </Grid>

            <Grid item xs={12} md={3} sx={{ py: 3, textAlign: "right" }}>
              <Typography variant="subtitle2">
                {" "}
                For Inevitable Electronics Pvt Ltd
              </Typography>

              <Typography variant="body2">Authorised Signatory</Typography>
            </Grid>
          </Grid>

          <Divider />

          <Grid container>
            <Grid item xs={12} md={9} sx={{ py: 3 }}>
              <Typography variant="subtitle2"> Terms Of Delivery</Typography>

              <Typography variant="body2">
                These Terms and Conditions (also, “Disclaimer”) are a legally
                binding document between the User of the website and Ecom
                Express Private Limited. .
              </Typography>
              <Typography variant="body2">
                Please read these terms and conditions carefully.
              </Typography>
              <Typography variant="body2">
                By accessing this website and any pages thereof, you, the user,
              </Typography>
            </Grid>

            {/* <Grid item xs={12} md={3} sx={{ py: 3, textAlign: "right" }}>
              <Typography variant="subtitle2">Have a Question?</Typography>

              <Typography variant="body2">support@minimals.cc</Typography>
            </Grid> */}
          </Grid>
        </Card>
      </Grid>
    </Grid>
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
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

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
