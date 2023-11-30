import { Helmet } from "react-helmet-async";
import { paramCase } from "change-case";
import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from "@mui/material";
// redux
import { useDispatch, useSelector } from "src/redux/store";
import { getProducts } from "src/redux/slices/product";
// routes
import { PATH_CUSTOMER, PATH_DASHBOARD } from "src/routes/paths";
// components
import { useSettingsContext } from "src/components/settings";
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "src/components/table";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import ConfirmDialog from "src/components/confirm-dialog";
// sections
import {
  ProductTableRow,
  ProductTableToolbar,
} from "src/sections/@dashboard/e-commerce/list";
import { CategoryTableToolbar } from "src/sections/@customer/category/list";
import { CategoryTableRow } from "src/sections/@customer/category/list";
import { Api, extractIdFromSlug } from "src/utils";
import apiUrls from "src/routes/apiUrls";
import Category from "src/controller/inventory/Category.controller";
import SubCategory from "src/controller/inventory/SubCategory.controller";
import Manufacture from "src/controller/inventory/Manufacture.controller";

const TABLE_HEAD = [
  { id: "image", label: "Image", align: "left" },
  { id: "productId", label: "Product Id", align: "left" },
  { id: "name", label: "Name", align: "left", width: 180 },
  { id: "description", label: "Discription", align: "left" },
  { id: "availability", label: "Availability", align: "left" },
  { id: "price", label: "Price", align: "left" },
  { id: "quantity", label: "Quantity", align: "center" },
];

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
];

// ----------------------------------------------------------------------

export default function ProductCategoryPage() {
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
    defaultOrderBy: "createdAt",
  });

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const { slug: categorySlug, subcategory } = useParams();
  const categoryId = extractIdFromSlug(categorySlug);
  let subcategoryId = "";

  if (subcategory) {
    subcategoryId = extractIdFromSlug(subcategory);
  }

  const [tableData, setTableData] = useState([]);
  const [manufactureList, setManufactureList] = useState([]);

  const [filterName, setFilterName] = useState("");
  const [filterManufacture, setFilterManufacture] = useState("all");
  const [filterStatus, setFilterStatus] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [category, setCategory] = useState({});

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterManufacture,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const denseHeight = dense ? 60 : 80;

  const isFiltered =
    filterName !== "" ||
    filterManufacture !== "all" ||
    filterStatus.length != 0;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterManufacture) ||
    !dataFiltered.length;

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const handleFilterManufacturer = (event) => {
    setPage(0);
    setFilterManufacture(event.target.value);
  };

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
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
    navigate(PATH_DASHBOARD.eCommerce.edit(paramCase(id)));
  };

  const handleViewRow = (id) => {
    navigate(PATH_CUSTOMER.product.detail(id));
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterStatus([]);
  };

  useEffect(() => {
    let fetchQuery = `?category=${categoryId}`;
    if (subcategoryId != "") fetchQuery = `?subcategory=${subcategoryId}`;

    Api.get(`${apiUrls.website.product}${fetchQuery}`).then((res) => {
      if (res.result) {
        setTableData(res.data);
      }
    });

    if (subcategoryId == "") {
      Category.get(categoryId).then((res) => setCategory(res));
    } else {
      SubCategory.get(subcategoryId).then((res) => setCategory(res));
    }
  }, [categoryId, subcategoryId]);

  useEffect(() => {
    Manufacture.list()
      .then((res) => setManufactureList(res))
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <Helmet>
        <title>{category?.name}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={category?.name ?? "Category"}
          links={[
            { name: "Home", href: PATH_CUSTOMER.home.root },
            {
              name: "Product",
              href: PATH_CUSTOMER.product.root,
            },
            { name: category?.name },
          ]}
        />

        <Card>
          <CategoryTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            statusOptions={STATUS_OPTIONS}
            isFiltered={isFiltered}
            filterRole={filterManufacture}
            manufacturers={manufactureList}
            onFilterManufacturer={handleFilterManufacturer}
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
              <Table size={dense ? "small" : "medium"} sx={{ minWidth: 960 }}>
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
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <CategoryTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.name)}
                          onViewRow={() => handleViewRow(row.id)}
                        />
                      ) : (
                        !isNotFound && (
                          <TableSkeleton
                            key={index}
                            sx={{ height: denseHeight }}
                          />
                        )
                      )
                    )}

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

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong>{" "}
            items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              // handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterManufacture,
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
      (product) =>
        product.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((product) => {
      let stock =
        product?.totalAvailableStock > 0 ? "available" : "unavailable";
      return filterStatus.includes(stock);
    });
  }

  if (filterManufacture !== "all") {
    inputData = inputData.filter(
      (product) => product.manufacturer === filterManufacture
    );
  }

  return inputData;
}
