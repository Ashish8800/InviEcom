import sum from "lodash/sum";
import { useEffect, useState } from "react";
// form
import { useFieldArray, useFormContext } from "react-hook-form";
import { useSettingsContext } from "src/components/settings";
// @mui
import {
  Box,
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
import { formateDate } from "src/utils";

// ----------------------------------------------------------------------
const StyledRowResult = styled(TableRow)(({ theme }) => ({
  "& td": {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const TABLE_HEAD = [
  { id: "srNo", label: " SR.No", align: "center" },
  { id: "item", label: "Item & Description", align: "left" },
  { id: "quantity", label: "Quantity", align: "left" },
  { id: "rate", label: "Rate", align: "left" },
  { id: "discount", label: "Discount", align: "left" },
  { id: "amount", label: "Amount", align: "left" },
];

// ----------------------------------------------------------------------

export default function ReceiveNewEditDetails() {
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
    <Box sx={{ p: 2 }}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Stack sx={{ pb: 2 }} spacing={2}>
            <RHFSelect
              small
              name="purchaseRequest"
              label="Purchase Request*"
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
      </Grid>

      <Card sx={{ p: 1 }}>
        <Stack>
          <Grid container>
            <Grid item xs={12} md={6} sx={{ p: 2 }}>
              <Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Client Name:
                  </Typography>
                  <Typography>{purchaseRequest.clientName}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Project Name:
                  </Typography>
                  <Typography>{purchaseRequest.projectName}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Requested By:
                  </Typography>
                  <Typography>{purchaseRequest.indentor}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Approved By:
                  </Typography>
                  <Typography>{purchaseRequest.prApproverName}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Approver Comment:
                  </Typography>
                  <Typography>{purchaseRequest.prApproveComment}</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ p: 2 }}>
              <Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Expected Delivery Date:
                  </Typography>
                  <Typography>
                    {formateDate(purchaseRequest.deliveryDate)}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Deliver To:
                  </Typography>
                  <Typography> {purchaseRequest.deliverTo}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Ref:
                  </Typography>
                  <Typography> PO Number</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={12}>
              <Divider />

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
                        emptyRows={emptyRows(
                          page,
                          rowsPerPage,
                          tableData.length
                        )}
                      />

                      <TableNoData isNotFound={isNotFound} />
                      <StyledRowResult>
                        <TableCell colSpan={4} />

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
                          {fCurrency(tableTotal.subtotal).replace("$", "₹")}
                        </TableCell>
                      </StyledRowResult>

                      <StyledRowResult>
                        <TableCell colSpan={4} />

                        <TableCell align="left" sx={{ typography: "body1" }}>
                          Discount
                        </TableCell>

                        <TableCell
                          align="left"
                          width={120}
                          sx={{ color: "error.main", typography: "body1" }}
                        >
                          {fCurrency(tableTotal.discount).replace("$", "₹")}
                        </TableCell>
                      </StyledRowResult>

                      <StyledRowResult>
                        <TableCell colSpan={4} />

                        <TableCell align="left" sx={{ typography: "body1" }}>
                          Taxes
                        </TableCell>

                        <TableCell
                          align="left"
                          width={120}
                          sx={{ typography: "body1" }}
                        >
                          {fCurrency(tableTotal.taxes).replace("$", "₹")}
                        </TableCell>
                      </StyledRowResult>

                      <StyledRowResult>
                        <TableCell colSpan={4} />

                        <TableCell align="left" sx={{ typography: "h6" }}>
                          Total
                        </TableCell>

                        <TableCell
                          align="left"
                          width={140}
                          sx={{ typography: "h6" }}
                        >
                          {fCurrency(tableTotal.total).replace("$", "₹")}
                        </TableCell>
                      </StyledRowResult>
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
              <Divider />
            </Grid>
          </Grid>
        </Stack>
      </Card>
      <Grid item xs={12} md={12}>
        <Stack spacing={1} sx={{ pt: 2 }}>
          <Box
            rowGap={1}
            columnGap={1}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFSelect small name="vendor" label="Vendor" size="small">
              {vendorList?.map((option) => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    {option.vendorDisplayName}
                  </MenuItem>
                );
              })}
            </RHFSelect>
          </Box>

          <Grid item xs={12} md={6} sx={{ p: 1 }}>
            <Stack>
              <Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Vendor Name:
                  </Typography>
                  <Typography>{vendorData.vendorDisplayName}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Vendor Address:
                  </Typography>

                  <Typography>{`${vendorData.billing?.address ?? ""} ${
                    vendorData?.billing?.city ?? ""
                  } ${vendorData?.billing?.state ?? ""} ${
                    vendorData?.billing?.country ?? ""
                  } ${vendorData?.billing?.pincode ?? ""} `}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Stack>
        <Box
          rowGap={1}
          columnGap={1}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
        >
          <RHFSelect
            size="small"
            fullWidth
            name="poApprover"
            label="PO Approver"
          >
            {purchaseApproverLIst?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Box>
      </Grid>
    </Box>
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
