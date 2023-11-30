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
import { useEffect } from "react";
// routes
// _mock_
// components
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

import AddMailForm from "src/pages/dashboard/settings/email/AddMailDialog";
import ViewMailForm from "src/sections/@dashboard/user/account/email/ViewMailForm";
import MailTableRow from "./MailTableRow";

import { ViewGuard } from "src/auth/MyAuthGuard";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import Email from "src/controller/settings/Email.controller";
import { PATH_DASHBOARD } from "src/routes/paths";
// ----------------------------------------------------------------------

const STATUS_OPTIONS = ["all", "active", "banned"];

const TABLE_HEAD = [
  { id: "email", label: "Email", align: "left" },
  { id: "host", label: "Host", align: "left" },
  { id: "default", label: "Default", align: "left" },
  { id: "createdDate", label: "Created Date", align: "left" },
];
if (
  window.checkPermission("settings.email.update") ||
  window.checkPermission("settings.email.delete")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}

// ----------------------------------------------------------------------

export default function Email() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    onClose,
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

  const [requestError, setRequestError] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");
  const [viewEmail, setViewEmail] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailFormData, setEmailFormData] = useState("");

  const handleEmailOpen = () => {
    setEmailOpen(true);
  };
  const handleEmailClose = () => {
    Email.list()
      .then((result) => {
        setTableData(result);
      })
      .catch((error) => console.log(error));
    setEmailOpen(false);
    setViewEmail(false);
    setEmailFormData("");
  };

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

  // const handleCloseConfirm = () => {
  //   setOpenConfirm(false);
  // };
  const handleDeleteRow = (id) => {
    Email.delete(id)
      .then((res) => {
        enqueueSnackbar("Email deleted successfully", { variant: "error" });
        // setTableData(res);
        Email.list()
          .then((result) => setTableData(result))
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        setRequestError(error.message);
      });
  };

  const handleEditRow = (data) => {
    setEmailOpen(true);
    setEmailFormData(data);
  };
  const handleViewRow = (data) => {
    setViewEmail(true);
    setEmailFormData(data);
  };
  useEffect(() => {
    setIsLoading(true);
    Email.list()
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
    <ViewGuard permission="settings.email.read" page={true}>
      <Helmet>
        <title> Email</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Email"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Email" },
          ]}
          action={
            <ViewGuard permission="settings.email.create">
              <Button
                variant="contained"
                size="medium"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleEmailOpen}
              >
                New Email
              </Button>
            </ViewGuard>
          }
        />

        <AddMailForm
          open={emailOpen}
          data={emailFormData}
          onClose={handleEmailClose}
        />
        <ViewMailForm
          open={viewEmail}
          data={emailFormData}
          onClose={handleEmailClose}
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
                        <MailTableRow
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
