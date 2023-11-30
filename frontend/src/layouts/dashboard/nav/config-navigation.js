// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import SvgColor from "../../../components/svg-color";
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const ICONS = {
  blog: icon("ic_blog"),
  cart: icon("ic_cart"),
  chat: icon("ic_chat"),
  mail: icon("ic_mail"),
  user: icon("ic_user"),
  file: icon("ic_file"),
  lock: icon("ic_lock"),
  label: icon("ic_label"),
  blank: icon("ic_blank"),
  kanban: icon("ic_kanban"),
  folder: icon("ic_folder"),
  banking: icon("ic_banking"),
  booking: icon("ic_booking"),
  invoice: icon("ic_invoice"),
  calendar: icon("ic_calendar"),
  disabled: icon("ic_disabled"),
  external: icon("ic_external"),
  menuItem: icon("ic_menu_item"),
  ecommerce: icon("ic_ecommerce"),
  analytics: icon("ic_analytics"),
  dashboard: icon("ic_dashboard_new"),
  policy: icon("ic_policy"),
  inventory: icon("ic_inventory"),
};

const navConfig = [
  // ----------------------------------------------------------------------
  // MANAGEMENT
  {
    // subheader: 'management',
    items: [
      {
        title: "dashboard",
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard,
      },
    ],
  },
];

// ----------------------------------------------------------------------
// Inventory Menu List
let inventoryMenuItemList = {};

if (
  window.checkPermission("inventory.item.read") ||
  window.checkPermission("inventory.composite_item.read") ||
  window.checkPermission("inventory.warehouse.read") ||
  window.checkPermission("inventory.category.read") ||
  window.checkPermission("inventory.stock.read")
) {
  inventoryMenuItemList = {
    title: "Inventory",
    path: PATH_DASHBOARD.inventory.root,
    icon: ICONS.inventory,
    children: [],
  };
}

if (window.checkPermission("inventory.item.read")) {
  inventoryMenuItemList.children.push({
    title: "item",
    path: PATH_DASHBOARD.inventory.item.root,
  });
}

// if (window.checkPermission("inventory.composite_item.read")) {
//   inventoryMenuItemList.children.push({
//     title: "composite item",
//     path: PATH_DASHBOARD.inventory.composite.root,
//   });
// }

if (window.checkPermission("inventory.warehouse.read")) {
  inventoryMenuItemList.children.push({
    title: "warehouse",
    path: PATH_DASHBOARD.inventory.warehouse.root,
  });
}

if (window.checkPermission("inventory.category.read")) {
  inventoryMenuItemList.children.push({
    title: "category",
    path: PATH_DASHBOARD.inventory.category.root,
  });
}

if (window.checkPermission("inventory.stock.read")) {
  inventoryMenuItemList.children.push({
    title: "stock",
    path: PATH_DASHBOARD.inventory.stock.root,
  });
}

if (inventoryMenuItemList?.title)
  navConfig[0].items.push(inventoryMenuItemList);

// ----------------------------------------------------------------------
// Purchase Menu List
let purchaseMenuItemList = {};

if (
  window.checkPermission("purchase.vendor.read") ||
  window.checkPermission("purchase.purchase_request.read") ||
  window.checkPermission("purchase.purchase_quotation.read") ||
  window.checkPermission("purchase.purchase_order.read") ||
  window.checkPermission("purchase.invoice.read") ||
  window.checkPermission("purchase.purchase_receive.read")
) {
  purchaseMenuItemList = {
    title: "purchase",
    icon: ICONS.ecommerce,
    path: PATH_DASHBOARD.purchase.root,
    children: [],
  };
}

if (window.checkPermission("purchase.vendor.read")) {
  purchaseMenuItemList.children.push({
    title: "Vendor",
    path: PATH_DASHBOARD.purchase.vendor.root,
  });
}

if (window.checkPermission("purchase.purchase_request.read")) {
  purchaseMenuItemList.children.push({
    title: "purchase request",
    path: PATH_DASHBOARD.purchase.request.root,
  });
}
if (window.checkPermission("purchase.rfq.read")) {
  purchaseMenuItemList.children.push({
    title: "RFQ",
    path: PATH_DASHBOARD.purchase.rfq.root,
  });
}
if (window.checkPermission("purchase.quotation.read")) {
  purchaseMenuItemList.children.push({
    title: "Quotation",
    path: PATH_DASHBOARD.purchase.quotation.root,
  });
}

if (window.checkPermission("purchase.purchase_order.read")) {
  purchaseMenuItemList.children.push({
    title: "purchase order",
    path: PATH_DASHBOARD.purchase.order.root,
  });
}

if (window.checkPermission("purchase.invoice.read")) {
  purchaseMenuItemList.children.push({
    title: "proforma invoice",
    path: PATH_DASHBOARD.purchase.invoice.root,
  });
}

if (window.checkPermission("purchase.purchase_receive.read")) {
  purchaseMenuItemList.children.push({
    title: "purchase receive",
    path: PATH_DASHBOARD.purchase.receive.root,
  });
}

if (purchaseMenuItemList?.title) navConfig[0].items.push(purchaseMenuItemList);

// ----------------------------------------------------------------------
// Sales Menu List
let salesMenuItemList = {};

if (
  window.checkPermission("sales.customer.read") ||
  window.checkPermission("sales.products.read") ||
  window.checkPermission("sales.orders.read") ||
  window.checkPermission("sales.transaction.read")
) {
  salesMenuItemList = {
    title: "sales",
    path: PATH_DASHBOARD.sales.root,
    icon: ICONS.invoice,
    children: [],
  };
}

if (window.checkPermission("sales.customer.read")) {
  salesMenuItemList.children.push({
    title: "customers",
    path: PATH_DASHBOARD.sales.customer.root,
  });
}

if (window.checkPermission("sales.products.read")) {
  salesMenuItemList.children.push({
    title: "products",
    path: PATH_DASHBOARD.sales.product.root,
  });
}

if (window.checkPermission("sales.orders.read")) {
  salesMenuItemList.children.push({
    title: "orders",
    path: PATH_DASHBOARD.sales.order.root,
  });
}

// if (window.checkPermission("sales.transaction.read")) {
//   salesMenuItemList.children.push({
//     title: "transaction",
//     path: PATH_DASHBOARD.sales.transaction.root,
//   });
// }

if (salesMenuItemList?.title) navConfig[0].items.push(salesMenuItemList);

// ----------------------------------------------------------------------
// User & Roles Menu List
let userAndRoleMenuItemList = {};

if (
  window.checkPermission("users_and_roles.users.read") ||
  window.checkPermission("users_and_roles.roles.read")
) {
  userAndRoleMenuItemList = {
    title: "Users & Roles",
    path: PATH_DASHBOARD.userManagement.root,
    icon: ICONS.user,
    children: [],
  };
}

if (window.checkPermission("users_and_roles.users.read")) {
  userAndRoleMenuItemList.children.push({
    title: "users",
    path: PATH_DASHBOARD.userManagement.user.root,
  });
}

if (window.checkPermission("users_and_roles.roles.read")) {
  userAndRoleMenuItemList.children.push({
    title: "roles",
    path: PATH_DASHBOARD.userManagement.role.root,
  });
}

if (userAndRoleMenuItemList?.title)
  navConfig[0].items.push(userAndRoleMenuItemList);

// navConfig[0].items.push({
//   title: "report",
//   path: PATH_DASHBOARD.report.root,
//   icon: ICONS.file,
// });

// =====================================================
let settingsMenuList = {};

if (
  window.checkPermission("settings.tax.read") ||
  window.checkPermission("settings.email.read") ||
  window.checkPermission("settings.currency.read") ||
  window.checkPermission("settings.policies.read") ||
  window.checkPermission("settings.notification.read") ||
  window.checkPermission("settings.client.read") ||
  window.checkPermission("settings.project.read") ||
  window.checkPermission("settings.termsAndConditions.read")
) {
  settingsMenuList = {
    title: "Settings",
    path: PATH_DASHBOARD.settings.root,
    icon: ICONS.inventory,
    children: [],
  };
}

if (window.checkPermission("settings.tax.read")) {
  settingsMenuList.children.push({
    title: "tax",
    path: PATH_DASHBOARD.settings.tax.root,
  });
}

if (window.checkPermission("settings.email.read")) {
  settingsMenuList.children.push({
    title: "email",
    path: PATH_DASHBOARD.settings.email.root,
  });
}

if (window.checkPermission("settings.currency.read")) {
  settingsMenuList.children.push({
    title: "currency",
    path: PATH_DASHBOARD.settings.currency.root,
  });
}

if (window.checkPermission("settings.policies.read")) {
  settingsMenuList.children.push({
    title: "policies",
    path: PATH_DASHBOARD.settings.policies.root,
  });
}
if (window.checkPermission("settings.notification.read")) {
  settingsMenuList.children.push({
    title: "notification",
    path: PATH_DASHBOARD.settings.notification.root,
  });
}
if (window.checkPermission("settings.client.read")) {
  settingsMenuList.children.push({
    title: "client",
    path: PATH_DASHBOARD.settings.client.root,
  });
}
if (window.checkPermission("settings.project.read")) {
  settingsMenuList.children.push({
    title: "project",
    path: PATH_DASHBOARD.settings.project.root,
  });
}
if (window.checkPermission("settings.termsAndConditions.read")) {
  settingsMenuList.children.push({
    title: "terms & Conditions",
    path: PATH_DASHBOARD.settings.termsAndConditions.root,
  });
}

if (settingsMenuList?.title) navConfig[0].items.push(settingsMenuList);

export default navConfig;
