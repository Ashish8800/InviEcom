import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import {
  Card,
  Table,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from "@mui/material";
// routes
import { PATH_CUSTOMER } from "../../../routes/paths";
// _mock_
import { _userList } from "../../../_mock/arrays";
// components
import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../components/settings";
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "../../../components/table";
// sections
import {
  OrderTableRow,
  OrderTableToolbar,
} from "src/sections/@customer/customerorder/list";
import CustomerOrder from "src/controller/customer/CustomerOrder.controller";
import { customerId } from "src/auth/utils";
import { useEffect } from "react";
// ----------------------------------------------------------------------

const ROLE_OPTIONS = [
  "all",
  "ux designer",
  "full stack designer",
  "backend developer",
  "project manager",
  "leader",
  "ui designer",
  "ui/ux designer",
  "front end developer",
  "full stack developer",
];

const TABLE_HEAD = [
  { id: "orderId", label: "Order Id", align: "left" },
  { id: "orderDate", label: "Order Date", align: "left" },
  { id: "product", label: "Products", align: "left" },
  { id: "orderAmount", label: "Total Order Amount", align: "left" },
  { id: "paymentStatus", label: " Payment Status", align: "left" },
  { id: "deliveryStatus", label: " Order Status", align: "left" },
];

// ----------------------------------------------------------------------

export default function CustomerOrderListPage() {
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

  window.authorizedCustomerOnly();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [filterSearchQuery, setFilterOrderId] = useState("");

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterSearchQuery,
  });

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterSearchQuery !== "";

  const isNotFound = !dataFiltered.length && !!filterSearchQuery;

  const handleFilterSearchQuery = (event) => {
    setPage(0);
    setFilterOrderId(event.target.value);
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

  const handleViewRow = (id) => {
    navigate(PATH_CUSTOMER.order.view(id));
  };

  const handleResetFilter = () => {
    setFilterOrderId("");
  };

  useEffect(() => {
    CustomerOrder.list(`?customerId=${customerId()}`)
      .then((res) => {
        setTableData(res);
        console.log(res,"-----------------------------------");
      })
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <>
      <Helmet>
        <title> Order</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Order History"
          links={[
            { name: "Home", href: PATH_CUSTOMER.home.root },
            { name: "Order", href: PATH_CUSTOMER.order.history },
            { name: "List" },
          ]}
        />

        <Card>
          <Divider />

          <OrderTableToolbar
            isFiltered={isFiltered}
            filterName={filterSearchQuery}
            onFilterName={handleFilterSearchQuery}
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
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary">
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
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
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
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterSearchQuery }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterSearchQuery) {
    inputData = inputData.filter((order) => {
      let paymentStatus = order.paymentStatus ?? "";

      return (
        order.id.toLowerCase().indexOf(filterSearchQuery.toLowerCase()) !==
          -1 ||
        order.status.toLowerCase().indexOf(filterSearchQuery.toLowerCase()) !==
          -1 ||
        paymentStatus.toLowerCase().indexOf(filterSearchQuery.toLowerCase()) !==
          -1
      );
    });
  }

  return inputData;
}
