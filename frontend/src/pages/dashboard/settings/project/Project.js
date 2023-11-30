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

// components
import { useEffect } from "react";
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
import AddProjectDialog from "src/pages/dashboard/settings/project/AddProjectDialog.js";
import ProjectTableRow from "../../../../sections/@dashboard/user/account/project/ProjectTableRow";

import { ViewGuard } from "src/auth/MyAuthGuard";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import Project from "src/controller/purchase/Project.controller";
import { PATH_DASHBOARD } from "src/routes/paths";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Project", align: "left" },
  { id: "client", label: "client", align: "left" },
  { id: "status", label: "Status", align: "left" },
];
if (
  window.checkPermission("settings.project.update") ||
  window.checkPermission("settings.project.delete")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}
// ----------------------------------------------------------------------

export default function ProjectDetail() {
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

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const [projectOpen, setProjectOpen] = useState(false);
  const [projectFormData, setProjectFormData] = useState("");
  const [viewProjectOpen, setViewProjectOpen] = useState(false);
  const [viewProjectFormData, setViewProjectFormData] = useState("");
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

  const handleProjectOpen = () => {
    setProjectOpen(true);
    setProjectFormData(false);
  };

  const handleProjectClose = () => {
    Project.list()
      .then((result) => {
        setTableData(result);
        result = result.reverse();
      })
      .catch((error) => console.log(error));

    setProjectFormData("");
    setProjectOpen(false);
  };

  const handleViewProjectClose = () => {
    setViewProjectFormData("");
    setViewProjectOpen(false);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleDeleteRow = (id) => {
    Project.delete(id)
      .then((res) => {
        enqueueSnackbar("Project deleted successfully", { variant: "error" });
        Project.list()
          .then((result) => setTableData(result))
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        setRequestError(error.message, { variant: "error" });
      });
  };

  const handleEditRow = (data) => {
    setProjectFormData(data);
    setProjectOpen(true);
  };
  const handleViewRow = (data) => {
    setViewProjectFormData(data);
    setViewProjectOpen(true);
  };

  useEffect(() => {
    setIsLoading(true);
    Project.list()
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
    <ViewGuard permission="settings.project.read" page={true}>
      <Helmet>
        <title> Project</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Project"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Project" },
          ]}
          action={
            <ViewGuard permission="settings.project.create">
              <Button
                variant="contained"
                size="medium"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleProjectOpen}
              >
                Project
              </Button>
            </ViewGuard>
          }
        />
        <AddProjectDialog
          open={projectOpen}
          data={projectFormData}
          onClose={handleProjectClose}
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
                        <ProjectTableRow
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
