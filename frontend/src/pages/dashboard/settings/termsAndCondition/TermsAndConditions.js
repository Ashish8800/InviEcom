import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
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
import { PATH_DASHBOARD } from "src/routes/paths";
// _mock_
// components
import { useEffect } from "react";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSettingsContext } from "src/components/settings";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  getComparator,
  useTable,
} from "src/components/table";

import { useSnackbar } from "src/components/snackbar";

import { ViewGuard } from "src/auth/MyAuthGuard";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import TermsAndConditionController from "src/controller/settings/TermsAndCondition.controller";
import TermsAndConditionsTableRow from "../../../../sections/@dashboard/user/account/termsAndConditions/TermsAndConditionsTableRow";
import AddTermsAndConditionsDialog from "./dialog/AddTermsAndConditionsDialog";
import ViewTermsAndConditionsDialog from "./dialog/ViewTermsAndConditionsDialog";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "title", label: " Title", align: "left" },
  { id: "terms&Conditions", label: "T&C", align: "left" },
  { id: "default", label: "Default", align: "left" },
];
if (
  window.checkPermission("settings.termsAndConditions.update") ||
  window.checkPermission("settings.termsAndConditions.delete")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}
// ----------------------------------------------------------------------

export default function TermsAndConditions() {
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
  } = useTable({
    defaultOrderBy: "createdOn",
    defaultOrder: "desc",
  });

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMultiSelect, setFilterMultiSelect] = useState("all");

  const [termsAndConditionsOpen, setTermsAndConditionsOpen] = useState(false);
  const [termsAndConditionsFormData, setTermsAndConditionsFormData] =
    useState("");
  const [viewTermsAndConditionOpen, setViewTermsAndConditionOpen] =
    useState(false);
  const [viewTermsAndConditionFormData, setViewTermsAndConditionFormData] =
    useState({});
  const [requestError, setRequestError] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterMultiSelect,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleTermsAndConditionsOpen = () => {
    setTermsAndConditionsOpen(true);
    setTermsAndConditionsFormData(false);
  };

  const handleTermsAndConditionsClose = () => {
    TermsAndConditionController.list()
      .then((result) => {
        setTableData(result);
        result = result.reverse();
      })
      .catch((error) => console.log(error));

    setTermsAndConditionsFormData("");
    console.log(setTermsAndConditionsFormData());
    setTermsAndConditionsOpen(false);
  };

  const handleViewTermsAndConditionClose = () => {
    setViewTermsAndConditionFormData("");
    setViewTermsAndConditionOpen(false);
  };
  const handleFilterMultiSelect = (event) => {
    setFilterMultiSelect(event.target.value);
  };
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleDeleteRow = (id) => {
    TermsAndConditionController.delete(id)
      .then((res) => {
        enqueueSnackbar("TermsAndCondition deleted successfully", {
          variant: "error",
        });
        TermsAndConditionController.list()
          .then((result) => setTableData(result))
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        setRequestError(error.message, { variant: "error" });
      });
  };

  const handleEditRow = (data) => {
    setTermsAndConditionsFormData(data);
    setTermsAndConditionsOpen(true);
  };
  const handleViewRow = (data) => {
    setViewTermsAndConditionFormData(data);
    setViewTermsAndConditionOpen(true);
  };

  useEffect(() => {
    setIsLoading(true);
    TermsAndConditionController.list()
      .then((result) => {
        console.log(result);
        result = result.reverse();
        setTableData(result);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  return (
    <ViewGuard permission="settings.termsAndConditions.read" page={true}>
      <Helmet>
        <title> Terms & Conditions</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Terms & Conditions"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Terms & Conditions" },
          ]}
          action={
            <ViewGuard permission="settings.termsAndConditions.create">
              <Button
                variant="contained"
                size="medium"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleTermsAndConditionsOpen}
              >
                New T&C
              </Button>
            </ViewGuard>
          }
        />
        <AddTermsAndConditionsDialog
          filterService={filterMultiSelect}
          onFilterService={handleFilterMultiSelect}
          open={termsAndConditionsOpen}
          data={termsAndConditionsFormData}
          onClose={handleTermsAndConditionsClose}
        />
        <ViewTermsAndConditionsDialog
          open={viewTermsAndConditionOpen}
          data={viewTermsAndConditionFormData}
          onClose={handleViewTermsAndConditionClose}
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
                        <TermsAndConditionsTableRow
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
