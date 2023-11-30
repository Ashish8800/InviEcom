import { useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import {
  Container,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from "@mui/material";

// routes
// _mock_
// components
import sumBy from "lodash/sumBy";
import PropTypes from "prop-types";
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

import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import CategoryController from "src/controller/inventory/Category.controller";
import {
  CategoryTableRow,
  CategoryTableToolbar,
} from "src/sections/@dashboard/category/list";
// ----------------------------------------------------------------------

let TABLE_HEAD = [
  { id: "name", label: "Category Name", align: "left" },
  { id: "attribute", label: "Attributes", align: "left" },

  { id: "status", label: "Status", align: "left" },
];
if (
  window.checkPermission("inventory.category.update") ||
  window.checkPermission("inventory.category.delete") ||
  window.checkPermission("inventory.category.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}
// ----------------------------------------------------------------------

CategoryTable.propTypes = {
  onEdit: PropTypes.func,
};

export default function CategoryTable({ onEdit }) {
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

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");

  const [filterEndDate, setFilterEndDate] = useState(null);

  const [filterService, setFilterService] = useState("all");

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [requestError, setRequestError] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryView, setCategoryView] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterStatus !== "all" ||
    filterName !== "" ||
    filterService !== "all" ||
    (!!filterStartDate && !!filterEndDate);

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const getLengthByStatus = (status) =>
    tableData.filter((item) => item.status === status).length;

  const getTotalPriceByStatus = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      "totalPrice"
    );

  const getPercentByStatus = (status) =>
    (getLengthByStatus(status) / tableData.length) * 100;

  const handleFilterService = (event) => {
    setPage(0);
    setFilterService(event.target.value);
  };

  const handleCategoryOpen = () => {
    setCategoryFormData();
    setCategoryOpen(true);
  };

  const handleCategoryClose = () => {
    setCategoryOpen(false);
    setCategoryView(false);
    setCategoryFormData();
    CategoryController.list().then((list) => {
      list = list.reverse();
      setTableData(list);
    });
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    CategoryController.delete(id).then((res) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setSelected([]);
      setTableData(deleteRow);

      if (page > 0) {
        if (dataInPage.length < 2) {
          setPage(page - 1);
        }
      }
    });
  };

  const handleDeleteRows = (selectedRows) => {
    console.log(selectedRows);
    console.log("called deleted");
    return;
  };

  const handleEditRow = (data) => {
    setCategoryOpen(true);
    setCategoryFormData(data);
  };
  const handleViewRow = (data) => {
    setCategoryView(true);
    setCategoryFormData(data);
  };

  // const handleViewRow = (id) => {
  //   navigate(PATH_DASHBOARD.inventory.warehouse.view(id))
  // };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
  };

  // useEffects

  useEffect(() => {
    setIsLoading(true);
    CategoryController.list()
      .then((res) => {
        console.log(res);
        res = res.reverse();
        setTableData(res);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : "lg"}>
      <Divider />

      <CategoryTableToolbar
        isFiltered={isFiltered}
        filterName={filterName}
        filterRole={filterRole}
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
              // onSelectAllRows={(checked) =>
              //   onSelectAllRows(
              //     checked,
              //     tableData.map((row) => row.id)
              //   )
              // }
              onSelectAllRows={false}
            />

            <TableBody>
              {!isLoading &&
                dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CategoryTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => onEdit(row)}
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
        onChangeDense={onChangeDense}
      />
    </Container>
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
