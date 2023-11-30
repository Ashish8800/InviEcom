import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// form
import { useFormContext } from "react-hook-form";

// @mui
import {
  Divider,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableContainer,
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

import InlineText from "src/components/InlineText";
import {
  RHFMultiSelect,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Vendor from "src/controller/purchase/Vendor.controller";
import { PATH_DASHBOARD } from "src/routes/paths";
import {
  RFQComponentTableRow,
  RFQComponentTableToolbar,
} from "src/sections/@dashboard/purchase/rfq/list/index";

const TABLE_HEAD = [
  // { id: "", label: "", align: "left" },
  { id: "components", label: "Components", align: "left" },
  { id: "description", label: "Description", align: "left" },
  { id: "quantity", label: "Quantity", align: "left" },
];
// ----------------------------------------------------------------------
RFQFormDetails.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object,
  onCreate: PropTypes.func,
  tnc: PropTypes.array,
};

export default function RFQFormDetails({ data, tnc }) {
  const [tableData, setTableData] = useState([]);
  const [vendorData, setVendorData] = useState({});
  const [vendorList, setVendorList] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [requestDetails, setRequestDetails] = useState({});

  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [tableAccounts, setTableAccounts] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
  });
  const [deliveryStatus, setDeliveryStatus] = useState(true);
  // ===================================================================================

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

  const navigate = useNavigate();
  const { id } = useParams();

  const { watch, setValue, formState, resetField } = useFormContext();

  const values = watch();

  useEffect(() => {
    if (data) {
      setRequestDetails(data);
      setTableData(data.items ?? []);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

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

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.inventory.item.view(id));
  };

  useEffect(() => {
    Vendor.list()
      .then((res) => {
        setVendorList(res);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (values.vendorId) {
      vendorList?.forEach((item) => {
        if (item.id == values.vendorId) setVendorData(item);
      });
    }
  }, [values.vendorId]);

  useEffect(() => {
    const tempItems = [];
    selected.forEach((item) => {
      let tempData = tableData.filter((tblItem) => tblItem.id === item);
      if (tempData.length > 0) tempData = tempData[0];
      tempItems.push(tempData);
    });
    setValue("items", tempItems);
  }, [selected]);

  useEffect(() => {
    if (requestDetails?.id) setValue("prRequestId", requestDetails?.id);
  }, [requestDetails]);

  return (
    <Stack
      p={3}
      spacing={2}
      divider={
        <Divider orientation="horizontal" sx={{ borderStyle: "dashed" }} />
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <InlineText tag="PR Number:" value={requestDetails?.id} />
            <InlineText tag="Indentor:" value={requestDetails?.indentor} />
            <InlineText
              tag="PR Approver:"
              value={requestDetails?.prApproverName}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <InlineText tag="Client Name:" value={requestDetails?.clientName} />
            <InlineText
              tag="Project Name:"
              value={requestDetails?.projectName}
            />
          </Stack>
        </Grid>
      </Grid>

      <Stack>
        <Typography variant="h6">Components Details</Typography>

        <Divider sx={{ my: 1 }} />
        <RFQComponentTableToolbar
          onFilterName={handleFilterName}
          onFilterRole={handleFilterRole}
          onResetFilter={handleResetFilter}
        />

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
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {tableData.map((row, index) => (
                  <RFQComponentTableRow
                    onSelectRow={() => onSelectRow(row.id)}
                    key={row.id}
                    row={row}
                    index={index}
                    onViewRow={() => handleViewRow(row.id)}
                  />
                ))}

                <TableNoData isNotFound={tableData.length === 0} />
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
        <Typography color="error">
          {formState.errors.items?.message ?? ""}
        </Typography>
      </Stack>

      <Grid container>
        <Grid item xs={12} md={6} pr={1}>
          <Stack spacing={2}>
            <RHFSelect size="small" fullWidth name="vendorId" label="Vendor">
              {vendorList?.map((option) => (
                <MenuItem key={option.id + option.name} value={option.id}>
                  {option.vendorDisplayName}
                </MenuItem>
              ))}
            </RHFSelect>

            <InlineText
              tag="Vendor Name:"
              value={vendorData?.vendorDisplayName}
            />

            <InlineText
              tag="Vendor Address:"
              value={`${vendorData?.billing?.address ?? ""} ${
                vendorData?.billing?.city ?? ""
              } ${vendorData?.billing?.state ?? ""} ${
                vendorData?.billing?.country ?? ""
              } ${vendorData?.billing?.pincode ?? ""} `}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} pl={1}>
          <Stack spacing={2}>
            <RHFMultiSelect
              chip
              checkbox
              name="predefinedTermsAndCondition"
              label="Terms and Conditions"
              options={tnc ?? []}
            />

            <RHFTextField
              size="small"
              name="additionalTermAndCondition"
              label="Additional Terms and Conditions"
              multiline
              rows={4}
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
// =================================================================

function applyFilter({ inputData, comparator, filterName }) {
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
