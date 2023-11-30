import { lazy, Loadable } from "src/routes/utils";

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(
  lazy(() => import("src/pages/auth/LoginPage"))
);
export const RegisterPage = Loadable(
  lazy(() => import("src/pages/auth/RegisterPage"))
);
export const VerifyCodePage = Loadable(
  lazy(() => import("src/pages/auth/VerifyCodePage"))
);
export const NewPasswordPage = Loadable(
  lazy(() => import("src/pages/auth/NewPasswordPage"))
);
export const ChangePasswordPage = Loadable(
  lazy(() => import("src/pages/auth/ChangePasswordPage"))
);
export const ResetPasswordPage = Loadable(
  lazy(() => import("src/pages/auth/ResetPasswordPage"))
);

// DASHBOARD: GENERAL
export const GeneralAppPage = Loadable(
  lazy(() => import("src/pages/dashboard/GeneralAppPage"))
);
export const GeneralEcommercePage = Loadable(
  lazy(() => import("src/pages/dashboard/GeneralEcommercePage"))
);
export const GeneralAnalyticsPage = Loadable(
  lazy(() => import("src/pages/dashboard/GeneralAnalyticsPage"))
);
export const GeneralBankingPage = Loadable(
  lazy(() => import("src/pages/dashboard/GeneralBankingPage"))
);
export const GeneralBookingPage = Loadable(
  lazy(() => import("src/pages/dashboard/GeneralBookingPage"))
);
export const GeneralFilePage = Loadable(
  lazy(() => import("src/pages/dashboard/GeneralFilePage"))
);

// DASHBOARD: ECOMMERCE
export const EcommerceShopPage = Loadable(
  lazy(() => import("src/pages/dashboard/product/EcommerceShopPage"))
);
export const EcommerceProductDetailsPage = Loadable(
  lazy(() => import("src/pages/dashboard/product/EcommerceProductDetailsPage"))
);
export const EcommerceProductListPage = Loadable(
  lazy(() => import("src/pages/dashboard/product/EcommerceProductListPage"))
);
export const EcommerceProductCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/product/EcommerceProductCreatePage"))
);
export const EcommerceProductEditPage = Loadable(
  lazy(() => import("src/pages/dashboard/product/EcommerceProductEditPage"))
);
export const EcommerceCheckoutPage = Loadable(
  lazy(() => import("src/pages/dashboard/product/EcommerceCheckoutPage"))
);

// DASHBOARD: SALE
// export const SalesListPage = Loadable(
//   lazy(() => import("src/pages/dashboard/sales/SalesProductListPage"))
// );
// export const SalesDetailsPage = Loadable(
//   lazy(() => import("src/pages/dashboard/sales/SalesDetailsPage"))
// );
// export const SalesCreatePage = Loadable(
//   lazy(() => import("src/pages/dashboard/sales/SalesCreatePage"))
// );
// export const SalesEditPage = Loadable(
//   lazy(() => import("src/pages/dashboard/sales/SalesEditPage"))
// );

// DASHBOARD: ORDER
export const OrderListPage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/order/PurchaseOrderListPage"))
);
export const OrderDetailsPage = Loadable(
  lazy(() =>
    import("src/pages/dashboard/purchase/order/PurchaseOrderApprovalPage")
  )
);
export const OrderCreatePage = Loadable(
  lazy(() =>
    import("src/pages/dashboard/purchase/order/PurchaseOrderCreatePage")
  )
);
export const OrderEditPage = Loadable(
  lazy(() =>
    import("src/pages/dashboard/purchase/order/PurchaseOrderCreatePage")
  )
);

// DASHBOARD: POLICIES
export const PoliciesListPage = Loadable(
  lazy(() => import("src/pages/dashboard/policies/PoliciesListPage"))
);
// export const PoliciesDetailsPage = Loadable(
//   lazy(() => import('../pages/dashboard/policies/PoliciesDetailsPage'))
// );
export const PoliciesCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/policies/PoliciesCreatePage"))
);

// export const PoliciesEditPage = Loadable(lazy(() => import('../pages/dashboard/policies/PoliciesEditPage')));

// DASHBOARD: REPORT
export const ReportListPage = Loadable(
  lazy(() => import("src/pages/dashboard/report/ReportListPage"))
);

export const ReportDetailsPage = Loadable(
  lazy(() => import("src/pages/dashboard/report/ReportDetailsPage"))
);

// export const ReportCreatePage = Loadable(
//   lazy(() => import('../pages/dashboard/report/ReportCreatePage'))
// );

// export const ReportEditPage = Loadable(lazy(() => import('../pages/dashboard/report/ReportEditPage')));

// DASHBOARD: USER
export const UserProfilePage = Loadable(
  lazy(() => import("src/pages/dashboard/user/UserProfilePage"))
);
export const UserCardsPage = Loadable(
  lazy(() => import("src/pages/dashboard/user/UserCardsPage"))
);
export const UserListPage = Loadable(
  lazy(() => import("src/pages/dashboard/user/UserListPage"))
);
export const UserAccountPage = Loadable(
  lazy(() => import("src/pages/dashboard/user/UserAccountPage"))
);
export const UserCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/user/UserCreatePage"))
);
export const UserViewPage = Loadable(
  lazy(() => import("src/pages/dashboard/user/UserViewPage"))
);
export const UserEditPage = Loadable(
  lazy(() => import("src/pages/dashboard/user/UserEditPage"))
);

// export const WarehouseNewEditForm = Loadable(lazy(() => import('../pages/dashboard/inventry/WarehouseNewEditForm')));

// ----------------------

// ==========================================
export const ReceiveListPage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/receive/ReceiveListPage"))
);
export const ReceiveItemCreatePage = Loadable(
  lazy(() =>
    import("src/pages/dashboard/purchase/receive/ReceiveItemCreatePage.js")
  )
);
export const ReceiveViewPage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/receive/ReceiveViewPage.js"))
);
// =====================================================================================================
export const InvoiceListPage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/invoice/InvoiceListPage"))
);
export const InvoiceItemCreatePage = Loadable(
  lazy(() =>
    import("src/pages/dashboard/purchase/invoice/InvoiceItemCreatePage")
  )
);
export const InvoiceViewPage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/invoice/InvoiceViewPage"))
);
// DASHBOARD:ORDER

export const InvoiceApprovalCreatePage = Loadable(
  lazy(() =>
    import("src/pages/dashboard/purchase/invoice/InvoiceApprovalCreatePage")
  )
);

// DASHBOARD: ROLE
export const RoleProfilePage = Loadable(
  lazy(() => import("src/pages/dashboard/role/RoleProfilePage"))
);
export const RoleCardsPage = Loadable(
  lazy(() => import("src/pages/dashboard/role/RoleCardsPage"))
);
export const RoleListPage = Loadable(
  lazy(() => import("src/pages/dashboard/role/RoleListPage"))
);
export const RoleAccountPage = Loadable(
  lazy(() => import("src/pages/dashboard/role/RoleAccountPage"))
);
export const RoleCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/role/RoleCreatePage"))
);
export const RoleViewPage = Loadable(
  lazy(() => import("src/pages/dashboard/role/RoleViewPage"))
);

// DASHBOARD: settings

// DASHBOARD: BLOG
export const BlogPostsPage = Loadable(
  lazy(() => import("src/pages/dashboard/BlogPostsPage"))
);
export const BlogPostPage = Loadable(
  lazy(() => import("src/pages/dashboard/BlogPostPage"))
);
export const BlogNewPostPage = Loadable(
  lazy(() => import("src/pages/dashboard/BlogNewPostPage"))
);

// DASHBOARD: FILE MANAGER
export const FileManagerPage = Loadable(
  lazy(() => import("src/pages/dashboard/FileManagerPage"))
);

// DASHBOARD: APP
export const ChatPage = Loadable(
  lazy(() => import("src/pages/dashboard/ChatPage"))
);
export const MailPage = Loadable(
  lazy(() => import("src/pages/dashboard/MailPage"))
);
export const CalendarPage = Loadable(
  lazy(() => import("src/pages/dashboard/CalendarPage"))
);
export const KanbanPage = Loadable(
  lazy(() => import("src/pages/dashboard/KanbanPage"))
);

// TEST RENDER PAGE BY ROLE
export const PermissionDeniedPage = Loadable(
  lazy(() => import("src/pages/dashboard/PermissionDeniedPage"))
);

// BLANK PAGE
export const BlankPage = Loadable(
  lazy(() => import("src/pages/dashboard/BlankPage"))
);

// MAIN
export const Page500 = Loadable(lazy(() => import("src/pages/Page500")));
export const Page403 = Loadable(lazy(() => import("src/pages/Page403")));
export const Page404 = Loadable(lazy(() => import("src/pages/Page404")));
export const HomePage = Loadable(lazy(() => import("src/pages/HomePage")));
export const FaqsPage = Loadable(lazy(() => import("src/pages/FaqsPage")));
export const AboutPage = Loadable(lazy(() => import("src/pages/AboutPage")));
export const Contact = Loadable(lazy(() => import("src/pages/ContactPage")));

export const PricingPage = Loadable(
  lazy(() => import("src/pages/PricingPage"))
);
export const PaymentPage = Loadable(
  lazy(() => import("src/pages/PaymentPage"))
);
export const ComingSoonPage = Loadable(
  lazy(() => import("src/pages/ComingSoonPage"))
);
export const MaintenancePage = Loadable(
  lazy(() => import("src/pages/MaintenancePage"))
);

// customer component all elements
// ===========================================================================================

// dashboard :product

export const ProductShopPage = Loadable(
  lazy(() => import("src/pages/customer/product/ProductShopPage"))
);
export const ProductDetailsPage = Loadable(
  lazy(() => import("src/pages/customer/product/ProductDetailsPage"))
);
export const ProductListPage = Loadable(
  lazy(() => import("src/pages/customer/product/ProductCategoryPage"))
);
export const ProductCreatePage = Loadable(
  lazy(() => import("src/pages/customer/product/ProductCreatePage"))
);
export const ProductEditPage = Loadable(
  lazy(() => import("src/pages/customer/product/ProductEditPage"))
);
export const ProductCheckoutPage = Loadable(
  lazy(() => import("src/pages/customer/product/ProductCheckoutPage"))
);

// dashboard :home

export const CustomerCheckoutPage = Loadable(
  lazy(() => import("src/pages/customer/cart/CustomerCheckoutPage"))
);

export const ManufacturerListPage = Loadable(
  lazy(() => import("src/pages/customer/manufacturer/ManufacturerListPage"))
);
export const ContactListPage = Loadable(
  lazy(() => import("src/pages/customer/contact/ContactListPage"))
);
export const ProductCategoryPage = Loadable(
  lazy(() => import("src/pages/customer/product/ProductCategoryPage"))
);

export const ProductDetailPage = Loadable(
  lazy(() => import("src/pages/customer/product/ProductDetailPage"))
);

export const CustomerHomePage = Loadable(
  lazy(() => import("src/pages/customer/home/CustomerHomePage"))
);
export const CustomerProfilePage = Loadable(
  lazy(() => import("src/pages/customer/user/CustomerProfilePage"))
);
export const CustomerAccountPage = Loadable(
  lazy(() => import("src/pages/customer/user/CustomerAccountPage"))
);

export const CustomerOrderListPage = Loadable(
  lazy(() => import("src/pages/customer/orderhistory/CustomerOrderListPage"))
);
export const CustomerOrderCreatePage = Loadable(
  lazy(() => import("src/pages/customer/orderhistory/CustomerOrderCreatePage"))
);
//////====================================================login
export const CustomerLoginPage = Loadable(
  lazy(() => import("src/pages/customer/login/CustomerLoginPage"))
);
export const CustomerRegisterPage = Loadable(
  lazy(() => import("src/pages/customer/login/CustomerRegisterPage"))
);
export const CustomerVerifyCodePage = Loadable(
  lazy(() => import("src/pages/customer/login/CustomerVerifyCodePage"))
);
export const CustomerNewPasswordPage = Loadable(
  lazy(() => import("src/pages/customer/login/CustomerNewPasswordPage"))
);
export const CustomerResetPasswordPage = Loadable(
  lazy(() => import("src/pages/customer/login/CustomerResetPasswordPage"))
);

// -------------------------------------------------------------==
// SALES

export const SalesOrderListPage = Loadable(
  lazy(() => import("src/pages/dashboard/sales/SalesOrderListPage"))
);
export const SalesOrderCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/sales/SalesOrderCreatePage"))
);

export const TransactionListPage = Loadable(
  lazy(() => import("src/pages/dashboard/sales/TransactionListPage"))
);
export const TransactionCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/sales/TransactionCreatePage"))
);
// export const SalesOrderEditPage = Loadable(
//   lazy(() => import("src/pages/dashboard/sales/SalesOrderEditPage"))
// );

// ------------------------------------------------------------
export const CustomerListPage = Loadable(
  lazy(() => import("src/pages/dashboard/sales/CustomerListPage"))
);
export const CustomerCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/sales/CustomerCreatePage"))
);
export const CustomerEditPage = Loadable(
  lazy(() => import("src/pages/dashboard/sales/CustomerEditPage"))
);
export const CustomerNewEditForm = Loadable(
  lazy(() => import("src/pages/dashboard/sales/CustomerNewEditForm"))
);
// ------------------------------------------------------------------------------------------------
export const SalesProductListPage = Loadable(
  lazy(() => import("src/pages/dashboard/sales/SalesProductListPage"))
);
export const SalesProductCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/sales/SalesProductCreatePage"))
);
export const ProductSelectCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/sales/ProductSelectCreatePage"))
);
export const SalesProductEditPage = Loadable(
  lazy(() => import("src/pages/dashboard/sales/SalesProductEditPage"))
);
export const SalesProductNewEditForm = Loadable(
  lazy(() => import("src/pages/dashboard/sales/SalesProductNewEditForm"))
);
// DEMO COMPONENTS
// ----------------------------------------------------------------------

export const ComponentsOverviewPage = Loadable(
  lazy(() => import("src/pages/components/ComponentsOverviewPage"))
);

// FOUNDATION
export const FoundationColorsPage = Loadable(
  lazy(() => import("src/pages/components/foundation/FoundationColorsPage"))
);
export const FoundationTypographyPage = Loadable(
  lazy(() => import("src/pages/components/foundation/FoundationTypographyPage"))
);
export const FoundationShadowsPage = Loadable(
  lazy(() => import("src/pages/components/foundation/FoundationShadowsPage"))
);
export const FoundationGridPage = Loadable(
  lazy(() => import("src/pages/components/foundation/FoundationGridPage"))
);
export const FoundationIconsPage = Loadable(
  lazy(() => import("src/pages/components/foundation/FoundationIconsPage"))
);

// MUI COMPONENTS
export const MUIAccordionPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIAccordionPage"))
);
export const MUIAlertPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIAlertPage"))
);
export const MUIAutocompletePage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIAutocompletePage"))
);
export const MUIAvatarPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIAvatarPage"))
);
export const MUIBadgePage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIBadgePage"))
);
export const MUIBreadcrumbsPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIBreadcrumbsPage"))
);
export const MUIButtonsPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIButtonsPage"))
);
export const MUICheckboxPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUICheckboxPage"))
);
export const MUIChipPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIChipPage"))
);
export const MUIDataGridPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIDataGridPage"))
);
export const MUIDialogPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIDialogPage"))
);
export const MUIListPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIListPage"))
);
export const MUIMenuPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIMenuPage"))
);
export const MUIPaginationPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIPaginationPage"))
);
export const MUIPickersPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIPickersPage"))
);
export const MUIPopoverPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIPopoverPage"))
);
export const MUIProgressPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIProgressPage"))
);
export const MUIRadioButtonsPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIRadioButtonsPage"))
);
export const MUIRatingPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIRatingPage"))
);
export const MUISliderPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUISliderPage"))
);
export const MUIStepperPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUIStepperPage"))
);
export const MUISwitchPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUISwitchPage"))
);
export const MUITablePage = Loadable(
  lazy(() => import("src/pages/components/mui/MUITablePage"))
);
export const MUITabsPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUITabsPage"))
);
export const MUITextFieldPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUITextFieldPage"))
);
export const MUITimelinePage = Loadable(
  lazy(() => import("src/pages/components/mui/MUITimelinePage"))
);
export const MUITooltipPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUITooltipPage"))
);
export const MUITransferListPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUITransferListPage"))
);
export const MUITreesViewPage = Loadable(
  lazy(() => import("src/pages/components/mui/MUITreesViewPage"))
);

// EXTRA
export const DemoAnimatePage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoAnimatePage"))
);
export const DemoCarouselsPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoCarouselsPage"))
);
export const DemoChartsPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoChartsPage"))
);
export const DemoCopyToClipboardPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoCopyToClipboardPage"))
);
export const DemoEditorPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoEditorPage"))
);
export const DemoFormValidationPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoFormValidationPage"))
);
export const DemoImagePage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoImagePage"))
);
export const DemoLabelPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoLabelPage"))
);
export const DemoLightboxPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoLightboxPage"))
);
export const DemoMapPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoMapPage"))
);
export const DemoMegaMenuPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoMegaMenuPage"))
);
export const DemoMultiLanguagePage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoMultiLanguagePage"))
);
export const DemoNavigationBarPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoNavigationBarPage"))
);
export const DemoOrganizationalChartPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoOrganizationalChartPage"))
);
export const DemoScrollbarPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoScrollbarPage"))
);
export const DemoSnackbarPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoSnackbarPage"))
);
export const DemoTextMaxLinePage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoTextMaxLinePage"))
);
export const DemoUploadPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoUploadPage"))
);
export const DemoMarkdownPage = Loadable(
  lazy(() => import("src/pages/components/extra/DemoMarkdownPage"))
);

// DASHBOARD > PURCHASE > REQUEST ========================================================|| START ||

export * from "src/pages/dashboard/purchase/request";

// DASHBOARD > PURCHASE > REQUEST ==========================================================|| END ||

// DASHBOARD > PURCHASE > ORDER ========================================================|| START ||

export * from "src/pages/dashboard/purchase/order";

// DASHBOARD > PURCHASE > ORDER ==========================================================|| END ||

// DASHBOARD > PURCHASE > RFQ ========================================================|| START ||

export * from "src/pages/dashboard/purchase/rfq";

// DASHBOARD > PURCHASE > RFQ ==========================================================|| END ||

// DASHBOARD > PURCHASE > Quotation ========================================================|| START ||

export * from "src/pages/dashboard/purchase/rfq";

// DASHBOARD > PURCHASE > Quotation ==========================================================|| END ||

// DASHBOARD > PURCHASE > Vendor ========================================================|| START ||

export * from "src/pages/dashboard/purchase/vendor";

// DASHBOARD > PURCHASE > Vendor ==========================================================|| END ||

// DASHBOARD > INVENTORY > Item ========================================================|| START ||

export * from "src/pages/dashboard/inventry/item";

// DASHBOARD > INVENTORY > Item ==========================================================|| END ||

// DASHBOARD > INVENTORY > Warehouse ========================================================|| START ||

export * from "src/pages/dashboard/inventry/warehouse";

// DASHBOARD > INVENTORY > Warehouse ==========================================================|| END ||

// DASHBOARD > INVENTORY > Category ========================================================|| START ||

export * from "src/pages/dashboard/inventry/category";

// DASHBOARD > INVENTORY > Category ==========================================================|| END ||

// DASHBOARD > SETTINGS ========================================================|| START ||

export * from "src/pages/dashboard/settings";

// DASHBOARD >  SETTINGS==========================================================|| END ||
