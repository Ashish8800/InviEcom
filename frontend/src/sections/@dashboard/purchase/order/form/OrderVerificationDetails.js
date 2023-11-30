import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// form
import { useFormContext } from "react-hook-form";
import { useSettingsContext } from "src/components/settings";
// @mui
import { Box, Card, Stack, TableRow, Typography } from "@mui/material";

// utils
// components
import {
  RHFRadioGroup,
  RHFTextField,
} from "../../../../../components/hook-form";

import { PATH_DASHBOARD } from "src/routes/paths";
// _mock_

import { styled } from "@mui/material/styles";
import { getComparator, useTable } from "src/components/table";
import PurchaseOrder from "src/controller/purchase/PurchaseOrder.controller";
import Comment from "../../../blog/comment/Comment";
import PurchaseOrderPreview from "../PurchaseOrderPreview";

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

export default function OrderVerificationDetails({ id }) {
  const [purchaseOrder, setPurchaseOrder] = useState({});

  const { control, setValue, watch, resetField } = useFormContext();

  const values = watch();

  // ===================================================================================

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [tableAccounts, setTableAccounts] = useState(0);

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

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const denseHeight = dense ? 52 : 72;

  const isFiltered =
    filterName !== "" || filterRole !== "all" || filterStatus !== "all";

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleEditRow = (id) => {
    console.log("handleEditRow", id);
    navigate(PATH_DASHBOARD.purchase.venderedit(id));
  };

  useEffect(() => {
    PurchaseOrder.get(id)
      .then((res) => {
        // setTableData(res.pr.items);
        setPurchaseOrder(res);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let subtotal = 0;
    tableData.forEach((item) => {
      subtotal = subtotal + item.quantity * item.price;
    });

    setTableAccounts({
      subtotal,
      total: subtotal,
      tax: 0,
      discount: 0,
    });
  }, [tableData]);

  return (
    <Box sx={{ p: 1 }}>
      <Card sx={{ m: 2 }}>
        <PurchaseOrderPreview />
      </Card>

      {/* <Grid item xs={12} md={12} sx={{ mt: 3, pl: 3 }}>
        <Stack direction="row">
          <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
            Verified By:
          </Typography>
          <Typography></Typography>
        </Stack>
        <Stack direction="row">
          <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
            Verified Date:
          </Typography>
          <Typography> </Typography>
        </Stack>

        <Stack direction="row">
          <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
            Verified Comments:
          </Typography>
          <Typography> Abhay Mishra</Typography>
        </Stack>

        <Stack sx={{ mt: 2 }}>
          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Correction By:
            </Typography>
            <Typography> Abhay Mishra</Typography>
          </Stack>{" "}
          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Correction Date:
            </Typography>
            <Typography> Abhay Mishra</Typography>
          </Stack>{" "}
          <Stack direction="row">
            <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
              Correction Comment:
            </Typography>
            <Typography> Abhay Mishra</Typography>
          </Stack>
        </Stack>
      </Grid> */}

      <Stack sx={{ mt: 2, p: 3 }}>
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
        <RHFTextField
          name="poVerificationComment"
          label="Comment"
          multiline
          rows={3}
        />
        <Stack direction="row" sx={{ p: 1 }}>
          <Typography sx={{ pt: 1, pr: 2 }}>Action</Typography>
          <RHFRadioGroup
            row
            spacing={2}
            name="status"
            options={[
              { label: " PO Verified", value: "verified" },
              { label: " PO Correction", value: "correction" },
              { label: "PO Cancel", value: "cancel" },
            ]}
          />
        </Stack>
      </Stack>
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
