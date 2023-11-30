import { Navigate, useRoutes } from "react-router-dom";
// auth
import GuestGuard from "../auth/GuestGuard";
// layouts
import CompactLayout from "../layouts/compact";
import CustomerLayout from "../layouts/customer";
import DashboardLayout from "../layouts/dashboard";
// config
import { PATH_AFTER_LOGIN } from "../config-global";
//
import {
  ChangePasswordPage,
  ComingSoonPage,
  ContactListPage,
  CustomerAccountPage,
  CustomerCheckoutPage,
  // Dashboard: Sales
  CustomerCreatePage,
  // ======================
  CustomerHomePage,
  CustomerListPage,
  //  =========customer:Login
  CustomerLoginPage,
  CustomerNewPasswordPage,
  CustomerOrderCreatePage,
  CustomerOrderListPage,
  // CustomerCardsPage,
  // CustomerCreatePage,
  CustomerProfilePage,
  CustomerRegisterPage,
  CustomerResetPasswordPage,
  CustomerVerifyCodePage,
  // Dashboard: General
  GeneralAppPage,
  // InventryOrderListPage,
  InvoiceApprovalCreatePage,
  InvoiceItemCreatePage,
  InvoiceListPage,
  InvoiceViewPage,
  LoginPage,
  MaintenancePage,
  ManufacturerListPage,
  OrderCreatePage,
  OrderDetailsPage,
  OrderEditPage,
  Page403,
  Page404,

  //
  Page500,
  PoliciesCreatePage,
  // Dashboard: Policies
  PoliciesListPage,
  //
  // customer: product
  ProductCategoryPage,
  ProductCheckoutPage,
  ProductDetailPage,
  Project,
  // dashboard:order
  PurchaseOrderListPage,
  // OrderApprovalNewEditDetails,
  //purchase receive
  ReceiveItemCreatePage,
  ReceiveListPage,
  ReceiveViewPage,
  ReportDetailsPage,
  // Dashboard: Report
  ReportListPage,
  ResetPasswordPage,
  RoleCreatePage,
  RoleListPage,
  RoleViewPage,
  SalesOrderCreatePage,
  SalesOrderListPage,
  SalesProductCreatePage,
  SalesProductListPage,
  TransactionCreatePage,
  TransactionListPage,
  UserAccountPage,
  UserCreatePage,
  // Dashboard: User
  UserListPage,
  UserProfilePage,
  UserViewPage,
} from "./elements";

import MyAuthGuard from "src/auth/MyAuthGuard";
import PolicyForm from "src/pages/customer/policy/PolicyForm";

import PurchaseOrderRoutes from "src/pages/dashboard/purchase/order";
import PurchaseRequestRoutes from "src/pages/dashboard/purchase/request";
import RFQRoutes from "src/pages/dashboard/purchase/rfq";
import QuotationRoutes from "src/pages/dashboard/purchase/quotation";
import VendorRoutes from "src/pages/dashboard/purchase/vendor";
// ---------------------------------------------------------

import InventoryRoutes from "src/pages/dashboard/inventry/item";
import WarehouseRoutes from "src/pages/dashboard/inventry/warehouse";
import StockRoutes from "src/pages/dashboard/inventry/stock";
import CategoryRoutes from "src/pages/dashboard/inventry/category";

// ----------------------------------------------------------------------

import SettingsRoutes from "src/pages/dashboard/settings";

// ?-----------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "auth",
      children: [
        {
          path: "login",
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },

        {
          element: <CompactLayout />,
          children: [
            { path: "reset-password", element: <ResetPasswordPage /> },
            { path: "reset-password/:token", element: <ChangePasswordPage /> },
          ],
        },
      ],
    },

    // Dashboard
    {
      path: "dashboard",
      element: (
        <MyAuthGuard>
          <DashboardLayout />
        </MyAuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: "app", element: <GeneralAppPage /> },

        { path: "settings", element: <UserAccountPage /> },

        {
          path: "user-management",
          children: [
            {
              element: (
                <Navigate to="/dashboard/user-management/user/list" replace />
              ),
              index: true,
            },

            {
              path: "user",
              children: [
                {
                  element: (
                    <Navigate
                      to="/dashboard/user-management/user/list"
                      replace
                    />
                  ),
                  index: true,
                },
                {
                  path: "pInviECom_Server/.envrofile",
                  element: <UserProfilePage />,
                },
                { path: "list", element: <UserListPage /> },
                { path: "new", element: <UserCreatePage /> },
                { path: ":userId/edit", element: <UserCreatePage /> },
                { path: ":userId/view", element: <UserViewPage /> },
              ],
            },

            {
              path: "role",
              children: [
                {
                  element: (
                    <Navigate
                      to="/dashboard/user-management/role/list"
                      replace
                    />
                  ),
                  index: true,
                },
                { path: "list", element: <RoleListPage /> },
                { path: "new", element: <RoleCreatePage /> },
                { path: ":roleId/edit", element: <RoleCreatePage /> },
                { path: ":roleId/view", element: <RoleViewPage /> },
              ],
            },
          ],
        },

        {
          path: "inventory",
          children: [
            {
              element: <Navigate to="/dashboard/inventory/item" />,
              index: true,
            },

            InventoryRoutes,
            WarehouseRoutes,
            StockRoutes,
            CategoryRoutes,
          ],
        },
        {
          path: "purchase",
          children: [
            {
              element: <Navigate to="/dashboard/purchase/request" />,
              index: true,
            },
            PurchaseRequestRoutes,
            RFQRoutes,
            QuotationRoutes,
            PurchaseOrderRoutes,
            VendorRoutes,

            {
              path: "receive",
              children: [
                { element: <ReceiveListPage />, index: true },
                {
                  path: "new",
                  element: <ReceiveItemCreatePage />,
                },
                {
                  path: ":id/edit",
                  element: <ReceiveItemCreatePage />,
                },
                {
                  path: ":id/view",
                  element: <ReceiveViewPage />,
                },
              ],
            },

            {
              path: "invoice",
              children: [
                { element: <InvoiceListPage />, index: true },
                {
                  path: "new",
                  element: <InvoiceItemCreatePage />,
                },
                {
                  path: ":id/edit",
                  element: <InvoiceItemCreatePage />,
                },
                {
                  path: ":id/view",
                  element: <InvoiceViewPage />,
                },
                {
                  path: ":id/approval",
                  element: <InvoiceApprovalCreatePage />,
                },
              ],
            },
          ],
        },

        // dashboard/orders/
        {
          path: "orders",
          children: [
            {
              element: <Navigate to="/dashboard/orders/list" replace />,
              index: true,
            },
            { path: "list", element: <PurchaseOrderListPage /> },
            { path: ":id", element: <OrderDetailsPage /> },
            { path: ":id/edit", element: <OrderEditPage /> },
            { path: "new", element: <OrderCreatePage /> },
          ],
        },

        // dashboard/sales
        {
          path: "sales",
          children: [
            {
              element: <Navigate to="/dashboard/sales/customer/list" />,
              index: true,
            },
            {
              path: "customer",
              children: [
                {
                  element: <Navigate to="/dashboard/sales/customer/list" />,
                  index: true,
                },
                { path: "list", element: <CustomerListPage /> },
                {
                  path: ":id",
                  element: <CustomerCreatePage />,
                },
              ],
            },

            // PRODUCTS
            {
              path: "product",

              children: [
                {
                  index: true,
                  element: <Navigate to="/dashboard/sales/product/list" />,
                },
                {
                  path: "list",
                  element: <SalesProductListPage />,
                },
                {
                  path: ":id",
                  element: <SalesProductCreatePage />,
                },
              ],
            },

            {
              path: "order",

              children: [
                {
                  index: true,
                  element: <Navigate to="/dashboard/sales/order/list" />,
                },
                {
                  path: "list",
                  element: <SalesOrderListPage />,
                },
                {
                  path: ":id",
                  element: <SalesOrderCreatePage />,
                },
              ],
            },

            {
              path: "transaction",

              children: [
                {
                  index: true,
                  element: <Navigate to="/dashboard/sales/transaction/list" />,
                },
                {
                  path: "list",
                  element: <TransactionListPage />,
                },
                {
                  path: ":id",
                  element: <TransactionCreatePage />,
                },
              ],
            },
          ],
        },

        {
          path: "policies",
          children: [
            {
              element: <Navigate to="/dashboard/policies/list" replace />,
              index: true,
            },
            { path: "list", element: <PoliciesListPage /> },

            { path: "new", element: <PoliciesCreatePage /> },
          ],
        },
        SettingsRoutes,

        {
          path: "report",
          children: [
            {
              element: <Navigate to="/dashboard/report/list" replace />,
              index: true,
            },
            { path: "list", element: <ReportListPage /> },
            { path: ":id", element: <ReportDetailsPage /> },
          ],
        },
      ],
    },

    // customer elements
    // ========================================================================
    {
      element: <CustomerLayout />,
      children: [
        {
          path: "",
          element: <CustomerHomePage />,
        },
        {
          path: "home",
          element: <CustomerHomePage />,
        },

        {
          path: "product",
          children: [
            {
              element: <CustomerHomePage />,
              index: true,
            },
            { path: ":slug", element: <ProductCategoryPage /> },
            { path: ":slug/:subcategory", element: <ProductCategoryPage /> },
            {
              path: ":productId/detail",
              element: <ProductDetailPage />,
            },
            { path: "checkout", element: <ProductCheckoutPage /> },
          ],
        },

        {
          path: "manufacturer",
          children: [
            {
              element: <CustomerHomePage />,
              index: true,
            },
            { path: ":slug", element: <ManufacturerListPage /> },
          ],
        },
        {
          path: "policy",
          children: [{ path: ":slug", element: <PolicyForm /> }],
        },
        {
          path: "contact",
          element: <ContactListPage />,
        },
        {
          path: "login",
          element: <CustomerLoginPage />,
        },
        {
          path: "register",
          element: <CustomerRegisterPage />,
        },
        { path: "login-unprotected", element: <CustomerLoginPage /> },
        { path: "register-unprotected", element: <CustomerRegisterPage /> },
        { path: "reset-password", element: <CustomerResetPasswordPage /> },
        { path: "new-password", element: <CustomerNewPasswordPage /> },
        { path: "verify", element: <CustomerVerifyCodePage /> },

        {
          path: "cart",
          element: <CustomerCheckoutPage />,
        },
        {
          path: "user",
          children: [
            {
              element: <Navigate to="/customer/user/profile" replace />,
              index: true,
            },
            { path: "profile", element: <CustomerProfilePage /> },
            { path: "new", element: <CustomerCreatePage /> },
            { path: ":userId/edit", element: <CustomerCreatePage /> },
            { path: "account", element: <CustomerAccountPage /> },
          ],
        },
        {
          path: "order",
          children: [
            {
              element: <Navigate to="/customer/order/history" replace />,
              index: true,
            },
            { path: "history", element: <CustomerOrderListPage /> },
            { path: ":orderId/edit", element: <CustomerOrderCreatePage /> },
            {
              path: ":id/view",
              element: <CustomerOrderCreatePage />,
            },
          ],
        },
      ],
    },

    // =============================================================================
    {
      element: <CompactLayout />,
      children: [
        { path: "coming-soon", element: <ComingSoonPage /> },

        { path: "maintenance", element: <MaintenancePage /> },
        { path: "500", element: <Page500 /> },
        { path: "404", element: <Page404 /> },
        { path: "403", element: <Page403 /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
