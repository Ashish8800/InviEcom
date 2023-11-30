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
// components
import Iconify from "src/components/iconify";
import { RHFSelect } from "../../../../../components/hook-form";

// _mock_

import DashedDivider from "src/components/DashedDivider";
import InlineText from "src/components/InlineText";
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
import OrderCretaeTableRow1 from "src/sections/@dashboard/purchase/order/list/OrderCreateTableRow1";
import { formateDate } from "src/utils";
import AddComponent from "./AddComponent";

// ----------------------------------------------------------------------
const StyledRowResult = styled(TableRow)(({ theme }) => ({
  "& td": {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const TABLE_HEAD = [
  { id: "componentDescription", label: "Component Description", align: "left" },
  { id: "quantity", label: " Quantity", align: "left" },
  { id: "unitPrice", label: "Unit Price", align: "left" },
  { id: "tax", label: "Tax (%)", align: "left" },
  { id: "amount", label: "Amount", align: "left" },
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

  const { themeStretch } = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [tableTotal, setTableTotal] = useState({});

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");
  const [warehouseOpen, setWarehouseOpen] = useState(false);

  const [componentOpen, setComponentOpen] = useState(false);
  const [componentFormData, setComponentFormData] = useState("");

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

  const handleComponentOpen = () => {
    setComponentOpen(true);
    setComponentFormData(false);
  };

  const handleComponentClose = () => {
    setComponentFormData("");
    setComponentOpen(false);
  };

  useEffect(() => {
    PurchaseRequest.list()
      .then((res) => {
        setPurchaseRequestList(res);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (values.purchaseRequest) {
      const prList = purchaseRequestList.filter(
        (pr) => pr.id === values.purchaseRequest
      );
      if (prList.length > 0) setPurchaseRequest(prList[0]);
    }
  }, [values]);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={12}>
        <Stack
          sx={{ pb: 2 }}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
        >
          <RHFSelect
            small
            name="purchaseRequest"
            label="PR Number"
            size="small"
          >
            {purchaseRequestList?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.id}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
        <Stack
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
        >
          <InlineText tag="PR Number:" value={purchaseRequest?.id} />
          <InlineText tag="Client:" value={purchaseRequest?.clientName} />
          <InlineText tag="Indentor:" value={purchaseRequest?.indentor} />
          <InlineText tag="Project:" value={purchaseRequest?.projectName} />
          <InlineText
            tag="Expected Delivery Date:"
            value={formateDate(purchaseRequest?.deliveryDate)}
          />
        </Stack>
        <DashedDivider />
        <Stack>
          <InlineText tag="Vendor:" value="Suresh Raina" />
          <InlineText tag="Vendor:" value="User Group" />
        </Stack>
        <DashedDivider />
        <Stack spacing={2}>
          <Stack direction="row" display="flex" justifyContent="space-between">
            <Stack>
              <Typography variant="h6">Select Components for PO</Typography>
            </Stack>
            <Stack>
              <Button
                variant="contained"
                size="medium"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleComponentOpen}
              >
                Component For PO
              </Button>
            </Stack>

            <AddComponent
              open={componentOpen}
              data={componentFormData}
              onClose={handleComponentClose}
            />
          </Stack>
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
                  <StyledRowResult>
                    <TableCell colSpan={3} />

                    <TableCell align="right" sx={{ typography: "body1" }}>
                      <Box sx={{ mt: 2 }} />
                      Total
                    </TableCell>

                    <TableCell
                      align="right"
                      width={120}
                      sx={{ typography: "body1" }}
                    >
                      <Box sx={{ mt: 2 }} />
                      1000
                    </TableCell>
                  </StyledRowResult>
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Stack>

        <DashedDivider />

        <Grid container display="flex" justifyContent="space-between">
          <Grid item xs={12} sm={3} md={6} sx={{ mt: 3, mb: 3 }}>
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
        </Grid>
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
