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

export default function OrderViewDetails({ po }) {
  const { control, setValue, watch } = useFormContext();

  const [vendorList, setVendorList] = useState([]);
  const [purchaseRequestList, setPurchaseRequestList] = useState([]);
  const [purchaseApproverLIst, setPurchaseApproverLIst] = useState([]);
  const [vendorData, setVendorData] = useState({});

  const { append } = useFieldArray({
    control,
    name: "items",
  });

  console.log(po);

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
    setTableData(po?.pr?.items ?? []);
  }, [po]);
  console.log(po);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Stack sx={{ pb: 2 }} spacing={2}>
            <Stack direction="row" sx={{ pl: 2, pt: 1 }}>
              <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                Purchase Request*:
              </Typography>
              <Typography>{po?.pr?.title}</Typography>
            </Stack>
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
                  <Typography>{po.clientName}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Project Name:
                  </Typography>
                  <Typography>{po.projectName}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Requested By:
                  </Typography>
                  <Typography>{po?.pr?.indentor}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Approved By:
                  </Typography>
                  <Typography>{po.prApproverName}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Approver Comment:
                  </Typography>
                  <Typography>{po.poApproveComment}</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ p: 2 }}>
              <Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Expected Delivery Date:
                  </Typography>
                  <Typography>{formateDate(po?.pr?.deliveryDate)}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Deliver To:
                  </Typography>
                  <Typography> {po?.pr?.deliverTo}</Typography>
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
          <Grid item xs={12} md={6} sx={{ p: 1 }}>
            <Stack>
              <Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Vendor Name:
                  </Typography>
                  <Typography>
                    {po?.vendorDetails?.vendorDisplayName}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Vendor Address:
                  </Typography>

                  <Typography>{`${po?.vendorDetails?.billing?.address ?? ""} ${
                    po?.vendorDetails?.billing?.city ?? ""
                  } ${po?.vendorDetails?.billing?.state ?? ""} ${
                    po?.vendorDetails?.billing?.country ?? ""
                  } ${po?.vendorDetails?.billing?.pincode ?? ""} `}</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    PO Approver:
                  </Typography>
                  <Typography>{po?.poApproverName}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Stack>
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
