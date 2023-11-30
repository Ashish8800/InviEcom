import sumBy from "lodash/sumBy";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
// @mui
import { Button, Card, Container, Stack, Tab, Tabs } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// utils
import { fTimestamp } from "src/utils/formatTime";
// _mock_
import { _invoices } from "src/_mock/arrays";
// components
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import { getComparator, useTable } from "src/components/table";
// sections
import { ViewGuard } from "src/auth/MyAuthGuard";
import Category from "src/controller/inventory/Category.controller";
import SubCategory from "src/controller/inventory/SubCategory.controller";
import CategoryTable from "src/pages/dashboard/inventry/category/CategoryTable.js";
import SubCategoryTable from "src/pages/dashboard/inventry/category/SubCategoryTable.js";
import AddCategoryForm from "./AddCategoryForm";
import AddSubCategoryForm from "./AddSubCategoryForm";
import CategoryController from "src/controller/inventory/Category.controller";

// ----------------------------------------------------------------------

export default function CategoryListPage() {
  const theme = useTheme();
  const { id } = useParams();
  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

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
  } = useTable({ defaultOrderBy: "createDate" });

  const [tableData, setTableData] = useState(_invoices);
  const [isLoading, setIsLoading] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryView, setCategoryView] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState();
  const [subcategoryOpen, setSubCategoryOpen] = useState(false);
  const [subcategoryFormData, setSubCategoryFormData] = useState();

  const [currentTab, setCurrentTab] = useState("category");

  const handleEditCategoryRow = (data) => {
    setCategoryOpen(true);
    setCategoryFormData(data);
  };

  const handleEditSubcategoryRow = (data) => {
    setSubCategoryOpen(true);
    setSubCategoryFormData(data);
  };
  const TABS = [
    {
      value: "category",
      label: "Category",
      color: "success",
      component: <CategoryTable onEdit={handleEditCategoryRow} />,
    },
    {
      value: "subcategory",
      label: "Sub Category",
      color: "success",
      component: <SubCategoryTable onEdit={handleEditSubcategoryRow} />,
    },
  ];

  const handleCategoryOpen = () => {
    setCategoryFormData();
    setCategoryOpen(true);
  };

  const handleCategoryClose = () => {
    setCategoryOpen(false);
    setCategoryView(false);
    setCategoryFormData();
    setIsLoading(true);
    CategoryController.list()
      .then((list) => {
        list = list.reverse();
        setTableData(list);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleSubCategoryOpen = () => {
    setSubCategoryFormData();
    setSubCategoryOpen(true);
  };

  const handleSubCategoryClose = () => {
    setSubCategoryOpen(false);
    setSubCategoryFormData();
    SubCategory.list().then((list) => {
      list = list.reverse();
      setTableData(list);
    });
  };

  return (
    <ViewGuard permission="inventory.category.read" page={true}>
      <Helmet>
        <title> Category</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Category"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Category",
              href: PATH_DASHBOARD.inventory.category.root,
            },
            { name: "List" },
          ]}
          action={
            <ViewGuard permission="inventory.category.create">
              <Stack>
                {currentTab == "category" ? (
                  <Button
                    fullWidth
                    value="category"
                    variant="contained"
                    size="large"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={handleCategoryOpen}
                  >
                    Category
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    value="subcategory"
                    variant="contained"
                    size="large"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={handleSubCategoryOpen}
                  >
                    Sub Category
                  </Button>
                )}
              </Stack>
            </ViewGuard>
          }
        />
        <AddCategoryForm
          open={categoryOpen}
          data={categoryFormData}
          onClose={handleCategoryClose}
        />
        <AddSubCategoryForm
          open={subcategoryOpen}
          data={subcategoryFormData}
          onClose={handleSubCategoryClose}
        />

        <Tabs
          value={currentTab}
          onChange={(event, newValue) => setCurrentTab(newValue)}
          sx={{
            px: 2,
            bgcolor: "background.neutral",
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>
        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Card key={tab.value}>{tab.component}</Card>
            )
        )}
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
  filterService,
  filterStartDate,
  filterEndDate,
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
      (invoice) =>
        invoice.invoiceNumber
          .toLowerCase()
          .indexOf(filterName.toLowerCase()) !== -1 ||
        invoice.invoiceTo.name
          .toLowerCase()
          .indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== "all") {
    inputData = inputData.filter((invoice) => invoice.status === filterStatus);
  }

  if (filterService !== "all") {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((c) => c.service === filterService)
    );
  }

  if (filterStartDate && filterEndDate) {
    inputData = inputData.filter(
      (invoice) =>
        fTimestamp(invoice.createDate) >= fTimestamp(filterStartDate) &&
        fTimestamp(invoice.createDate) <= fTimestamp(filterEndDate)
    );
  }

  return inputData;
}
