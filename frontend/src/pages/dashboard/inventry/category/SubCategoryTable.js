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
import PropTypes from "prop-types";

// routes
// _mock_
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
  emptyRows,
  getComparator,
  useTable,
} from "src/components/table";

import { useSnackbar } from "src/components/snackbar";
import SubCategoryController from "src/controller/inventory/SubCategory.controller";
import SubCategoryTableRow from "src/sections/@dashboard/category/list/SubCategoryTableRow.js";
import SubCategoryTableToolbar from "src/sections/@dashboard/category/list/SubCategoryTableToolbar";

// ----------------------------------------------------------------------

let TABLE_HEAD = [
  { id: "name", label: "Sub Category ", align: "left" },
  { id: "name", label: "Category ", align: "left" },
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

SubCategoryTable.propTypes = {
  onEdit: PropTypes.func,
};

export default function SubCategoryTable({ onEdit }) {
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
  const [subcategoryList, setSubCategoryList] = useState([]);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

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
  const isFiltered = filterStatus !== "all" || filterName !== "";

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleFilterName = (event) => {
    setPage(0);
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

  const handleSubCategoryOpen = () => {
    setSubCategoryOpen(true);
  };

  const handleSubCategoryClose = () => {
    if (selectedCategory != "") {
      SubCategoryController.list(`?categoryId=${selectedCategory}`)
        .then((res) => setSubCategoryList(res))
        .catch((err) => console.log(err));
    }
    setSubCategoryOpen(false);
  };

  useEffect(() => {
    if (selectedCategory != "") {
      SubCategoryController.list(`?categoryId=${selectedCategory}`)
        .then((res) => setSubCategoryList(res))
        .catch((err) => console.log(err));
    }
  }, [selectedCategory]);

  // useEffect(() => {
  //   if (values.category != "") setSelectedCategory(values.category);
  //   console.log(values.category);
  // }, [values.category]);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleDeleteRow = (id) => {
    SubCategoryController.delete(id)
      .then((res) => {
        enqueueSnackbar("SubCategory deleted successfully", {
          variant: "error",
        });
        SubCategoryController.list()
          .then((result) => setTableData(result))
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        setRequestError(error.message, { variant: "error" });
      });
  };

  // const handleEditRow = (data) => {
  //   setClientFormData(data);
  //   setClientOpen(true);
  // };
  // const handleViewRow = (data) => {
  //   setViewClientFormData(data);
  //   setViewClientOpen(true);
  // };

  useEffect(() => {
    SubCategoryController.list()
      .then((result) => {
        console.log(result);
        result = result.reverse();
        setTableData(result);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : "lg"}>
      <Divider />
      <SubCategoryTableToolbar
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
              onSelectAllRows={false}
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <SubCategoryTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => onSelectRow(row.id)}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onEditRow={() => onEdit(row)}
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
