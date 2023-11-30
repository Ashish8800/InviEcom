import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
// @mui
import {
  Button,
  Card,
  Container,
  Divider,
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
import AddPolicyDialog from "src/pages/dashboard/settings/policy/dialog/AddPolicyDialog";
import PolicyTableRow from "../../../../sections/@dashboard/user/account/policy/PolicyTableRow";

import { ViewGuard } from "src/auth/MyAuthGuard";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import Policy from "src/controller/settings/Policy.controller";
import ViewPolicyDialog from "src/pages/dashboard/settings/policy/dialog/ViewPolicyDialog";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "title", label: "Policy Title", align: "left" },
  { id: "description", label: "Description", align: "left" },
  { id: "effectiveDate", label: "Effective Date", align: "left" },
  { id: "createdBy", label: "Created By", align: "left" },

  { id: "createdDate", label: "Created Date", align: "left" },
];
if (
  window.checkPermission("settings.policies.update") ||
  window.checkPermission("settings.policies.delete")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}
// ----------------------------------------------------------------------

export default function PolicyDetail() {
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

  const [policyOpen, setPolicyOpen] = useState(false);
  const [policyFormData, setPolicyFormData] = useState("");
  const [viewPolicyOpen, setViewPolicyOpen] = useState(false);
  const [ViewPolicyDialogData, setViewPolicyDialogData] = useState("");
  const [requestError, setRequestError] = useState("");

  const { enqueueSnackbar } = useSnackbar();
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

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handlePolicyOpen = () => {
    setPolicyOpen(true);
    setPolicyFormData(false);
  };

  const handlePolicyClose = () => {
    Policy.list()
      .then((result) => {
        setTableData(result);
        result = result.reverse();
      })
      .catch((error) => console.log(error));

    setPolicyFormData("");
    setPolicyOpen(false);
  };

  const handleViewPolicyClose = () => {
    setViewPolicyDialogData("");
    setViewPolicyOpen(false);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleDeleteRow = (id) => {
    Policy.delete(id)
      .then((res) => {
        enqueueSnackbar("Policy deleted successfully", { variant: "error" });
        Policy.list()
          .then((result) => setTableData(result))
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        setRequestError(error.message, { variant: "error" });
      });
  };

  const handleEditRow = (data) => {
    setPolicyFormData(data);
    setPolicyOpen(true);
  };
  const handleViewRow = (data) => {
    setViewPolicyDialogData(data);
    setViewPolicyOpen(true);
  };

  useEffect(() => {
    setIsLoading(true);
    Policy.list()
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
    <ViewGuard permission="settings.policies.read" page={true}>
      <Helmet>
        <title> Policy</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Policy"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "policy" },
          ]}
          action={
            <ViewGuard permission="settings.policies.create">
              <Button
                variant="contained"
                size="medium"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handlePolicyOpen}
              >
                New Policy
              </Button>
            </ViewGuard>
          }
        />
        <AddPolicyDialog
          open={policyOpen}
          data={policyFormData}
          onClose={handlePolicyClose}
        />
        <ViewPolicyDialog
          open={viewPolicyOpen}
          data={ViewPolicyDialogData}
          onClose={handleViewPolicyClose}
        />

        <Card>
          <Divider />

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
                        <PolicyTableRow
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
