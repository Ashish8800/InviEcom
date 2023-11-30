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
// components
import Iconify from "src/components/iconify";
import { RHFSelect, RHFTextField } from "../../../../../components/hook-form";

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
import Client from "src/controller/purchase/Client.controller";
import OrderCretaeTableRow1 from "src/sections/@dashboard/purchase/order/list/OrderCreateTableRow1";
import Comment from "../../../blog/comment/Comment";
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
POCorrectionDetails.propTypes = {
  invoice: PropTypes.object,
};

export default function POCorrectionDetails(invoice) {
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
    Client.list()
      .then((result) => {
        console.log(result, "==============================");
        setTableData(result);
        result = result.reverse();
      })
      .catch((error) => console.log(error));

    setComponentFormData("");
    setComponentOpen(false);
  };

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      <Grid item xs={12} md={12}>
        <Stack
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
        >
          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              PO Number:
            </Typography>
            <Typography>PO0001</Typography>
          </Stack>
          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Indentor:
            </Typography>
            <Typography>shashank</Typography>
          </Stack>
          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              PR Number:
            </Typography>
            <Typography>PR0001</Typography>
          </Stack>
          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Client:
            </Typography>
            <Typography>shruti yadav</Typography>
          </Stack>
          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Expected Delivery Date:
            </Typography>
            <Typography>10/10/2023</Typography>
          </Stack>
          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Project:
            </Typography>
            <Typography>HRMS</Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ mt: 3 }}>
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

          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Vendor:
            </Typography>
            <Typography>name,address</Typography>
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
          <Divider />
        </Stack>
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
            name="poCorrectionComment"
            label="Comment"
            multiline
            rows={3}
          />
        </Stack>
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
