import { useState } from "react";
import { Helmet } from "react-helmet-async";
// @mui
import {
  Button,
  Card,
  Container,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from "@mui/material";
// routes
// _mock_
// components
import { useEffect } from "react";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSettingsContext } from "src/components/settings";
import { useSnackbar } from "src/components/snackbar";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  getComparator,
  useTable,
} from "src/components/table";

import { ViewGuard } from "src/auth/MyAuthGuard";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import Currency from "src/controller/settings/Currency.controller";
import AddCurrencyDialog from "src/pages/dashboard/settings/currency/dialog/AddCurrencyDialog";
import ViewCurrencyDialog from "src/pages/dashboard/settings/currency/dialog/ViewCurrencyDialog";
import { PATH_DASHBOARD } from "src/routes/paths";
import CurrencyTableRow from "../../../../sections/@dashboard/user/account/currency/CurrencyTableRow";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", align: "left" },
  { id: "symbol", label: "Symbol", align: "left" },
];
if (
  window.checkPermission("settings.currency.update") ||
  window.checkPermission("settings.currency.delete")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}
// ----------------------------------------------------------------------

export default function CurrencyDetail() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: "createdOn",
    defaultOrder: "desc",
  });

  const { themeStretch } = useSettingsContext();
  const [isLoading, setIsLoading] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");
  const [viewCurrency, setViewCurrency] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencyFormData, setCurrencyFormData] = useState("");

  const handleCurrencyOpen = () => {
    setCurrencyOpen(true);
  };
  const handleCurrencyClose = () => {
    Currency.list()
      .then((result) => {
        result = result.reverse();
        setTableData(result);
      })
      .catch((error) => console.log(error));
    setCurrencyFormData("");
    setCurrencyOpen(false);
    setViewCurrency(false);
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;
  const [requestError, setRequestError] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleDeleteRow = (id) => {
    Currency.delete(id)
      .then(() => {
        enqueueSnackbar("Currency deleted successfully");
        Currency.list()
          .then((result) => setTableData(result))
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        setRequestError(error.message, { variant: "error" });
      });
  };

  const handleEditRow = (data) => {
    setCurrencyOpen(true);
    setCurrencyFormData(data);
  };
  const handleViewRow = (data) => {
    setViewCurrency(true);
    setCurrencyFormData(data);
  };

  useEffect(() => {
    setIsLoading(true);
    Currency.list()

      .then((result) => {
        result = result.reverse();
        setTableData(result);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  return (
    <ViewGuard permission="settings.currency.read" page={true}>
      <Helmet>
        <title> Currency</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Currency"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Currency" },
          ]}
          action={
            <ViewGuard permission="settings.currency.create">
              <Button
                variant="contained"
                size="medium"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleCurrencyOpen}
              >
                New Currency
              </Button>
            </ViewGuard>
          }
        />
        <AddCurrencyDialog
          open={currencyOpen}
          data={currencyFormData}
          onClose={handleCurrencyClose}
        />
        <ViewCurrencyDialog
          open={viewCurrency}
          data={currencyFormData}
          onClose={handleCurrencyClose}
        />

        <Card>
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
                  {!isLoading &&
                    dataFiltered
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <CurrencyTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row)}
                          onViewRow={() => handleViewRow(row)}
                        />
                      ))}

                  <TableEmptyRows emptyRows={tableData.length} />

                  {isLoading && (
                    <TableBodySkeleton rows={10} columns={TABLE_HEAD.length} />
                  )}

                  <TableNoData isNotFound={!isLoading && isNotFound} />
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
    </ViewGuard>
  );
}

// ----------------------------------------------------------------------

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
