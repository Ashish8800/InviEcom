// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/dashboard";
const ROOTS_CUSTOMER = "";
// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "/login"),
  register: path(ROOTS_AUTH, "/register"),
  loginUnprotected: path(ROOTS_AUTH, "/login-unprotected"),
  registerUnprotected: path(ROOTS_AUTH, "/register-unprotected"),
  verify: path(ROOTS_AUTH, "/verify"),
  resetPassword: path(ROOTS_AUTH, "/reset-password"),
  newPassword: path(ROOTS_AUTH, "/new-password"),
};

export const PATH_PAGE = {
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  pricing: "/pricing",
  payment: "/payment",
  about: "/about-us",
  contact: "/contact-us",
  faqs: "/faqs",
  page403: "/403",
  page404: "/404",
  page500: "/500",
  components: "/components",
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  permissionDenied: path(ROOTS_DASHBOARD, "/permission-denied"),
  general: {
    app: path(ROOTS_DASHBOARD, "/app"),
  },

  userManagement: {
    root: path(ROOTS_DASHBOARD, "/user-management/"),
    user: {
      root: path(ROOTS_DASHBOARD, "/user-management/user/"),
      list: path(ROOTS_DASHBOARD, "/user-management/user/list"),
      new: path(ROOTS_DASHBOARD, "/user-management/user/new"),
      profile: path(ROOTS_DASHBOARD, "/user-management/user/profile"),
      edit: (name) =>
        path(ROOTS_DASHBOARD, `/user-management/user/${name}/edit`),
      view: (name) =>
        path(ROOTS_DASHBOARD, `/user-management/user/${name}/view`),
    },

    role: {
      root: path(ROOTS_DASHBOARD, "/user-management/role/"),
      list: path(ROOTS_DASHBOARD, "/user-management/role/list"),
      new: path(ROOTS_DASHBOARD, "/user-management/role/new"),
      profile: path(ROOTS_DASHBOARD, "/user-management/role/profile"),
      edit: (name) =>
        path(ROOTS_DASHBOARD, `/user-management/role/${name}/edit`),
      view: (name) =>
        path(ROOTS_DASHBOARD, `/user-management/role/${name}/view`),
    },
  },

  purchase: {
    root: path(ROOTS_DASHBOARD, "/purchase/"),
    request: {
      root: path(ROOTS_DASHBOARD, "/purchase/request/"),
      new: path(ROOTS_DASHBOARD, "/purchase/request/new"),
      view: (id) => path(ROOTS_DASHBOARD, `/purchase/request/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/purchase/request/${id}/edit`),
      approval: (id) =>
        path(ROOTS_DASHBOARD, `/purchase/request/${id}/approval`),
      correction: (id) =>
        path(ROOTS_DASHBOARD, `/purchase/request/${id}/correction`),
    },
    rfq: {
      root: path(ROOTS_DASHBOARD, "/purchase/rfq/"),
      new: (id) => path(ROOTS_DASHBOARD, `/purchase/rfq/${id}/new`),
      view: (id) => path(ROOTS_DASHBOARD, `/purchase/rfq/${id}/view`),
      edit: (rfqId) => path(ROOTS_DASHBOARD, `/purchase/rfq/${rfqId}/edit`),
      update: (id) => path(ROOTS_DASHBOARD, `/purchase/rfq/${id}/update`),
    },

    quotation: {
      root: path(ROOTS_DASHBOARD, "/purchase/quotation/"),
      new: path(ROOTS_DASHBOARD, `/purchase/quotation/new`),
      view: (id) => path(ROOTS_DASHBOARD, `/purchase/quotation/${id}/`),
      edit: (id) => path(ROOTS_DASHBOARD, `/purchase/quotation/${id}/edit`),
      update: (id) => path(ROOTS_DASHBOARD, `/purchase/quotation/${id}/update`),
    },
    order: {
      root: path(ROOTS_DASHBOARD, "/purchase/order/"),
      new: path(ROOTS_DASHBOARD, "/purchase/order/new"),
      view: (id) => path(ROOTS_DASHBOARD, `/purchase/order/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/purchase/order/${id}/edit`),
      approval: (id) => path(ROOTS_DASHBOARD, `/purchase/order/${id}/approval`),
      correction: (id) =>
        path(ROOTS_DASHBOARD, `/purchase/order/${id}/correction`),
      verification: (id) =>
        path(ROOTS_DASHBOARD, `/purchase/order/${id}/verification`),
    },
    vendor: {
      root: path(ROOTS_DASHBOARD, "/purchase/vendor/"),
      new: path(ROOTS_DASHBOARD, "/purchase/vendor/new"),
      view: (id) => path(ROOTS_DASHBOARD, `/purchase/vendor/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/purchase/vendor/${id}/edit`),
    },
    receive: {
      root: path(ROOTS_DASHBOARD, "/purchase/receive/"),
      new: path(ROOTS_DASHBOARD, "/purchase/receive/new"),
      view: (id) => path(ROOTS_DASHBOARD, `/purchase/receive/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/purchase/receive/${id}/edit`),
    },
    invoice: {
      root: path(ROOTS_DASHBOARD, "/purchase/invoice/"),
      new: path(ROOTS_DASHBOARD, "/purchase/invoice/new"),
      view: (id) => path(ROOTS_DASHBOARD, `/purchase/invoice/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/purchase/invoice/${id}/edit`),
      approval: (id) =>
        path(ROOTS_DASHBOARD, `/purchase/invoice/${id}/approval`),
    },
  },

  inventory: {
    root: path(ROOTS_DASHBOARD, "/inventory"),
    item: {
      root: path(ROOTS_DASHBOARD, "/inventory/item"),
      new: path(ROOTS_DASHBOARD, "/inventory/item/new"),
      component: path(ROOTS_DASHBOARD, "/inventory/item/component"),
      view: (id) => path(ROOTS_DASHBOARD, `/inventory/item/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/inventory/item/${id}/edit`),
      // edit: (id) => path(ROOTS_DASHBOARD, `/inventory/item/${id}/edit`),
    },

    // ===================================================

    warehouse: {
      root: path(ROOTS_DASHBOARD, "/inventory/warehouse"),
      view: (id) => path(ROOTS_DASHBOARD, `/inventory/warehouse/${id}/view`),
    },

    category: {
      root: path(ROOTS_DASHBOARD, "/inventory/category"),
      view: (id) => path(ROOTS_DASHBOARD, `/inventory/category/${id}/view`),
    },

    stock: {
      root: path(ROOTS_DASHBOARD, "/inventory/stock"),
      view: (id) => path(ROOTS_DASHBOARD, `/inventory/stock/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/inventory/stock/${id}/edit`),
    },
  },

  sales: {
    root: path(ROOTS_DASHBOARD, "/sales"),

    customer: {
      root: path(ROOTS_DASHBOARD, "/sales/customer"),
      list: path(ROOTS_DASHBOARD, "/sales/customer/list"),
      view: (id) => path(ROOTS_DASHBOARD, `/sales/customer/${id}`),
    },

    order: {
      root: path(ROOTS_DASHBOARD, "/sales/order"),
      list: path(ROOTS_DASHBOARD, "/sales/order/list"),
      view: (id) => path(ROOTS_DASHBOARD, `/sales/order/${id}`),
    },

    product: {
      root: path(ROOTS_DASHBOARD, "/sales/product"),
      list: path(ROOTS_DASHBOARD, "/sales/product/list"),
      view: (id) => path(ROOTS_DASHBOARD, `/sales/product/${id}`),
    },

    transaction: {
      root: path(ROOTS_DASHBOARD, "/sales/transaction"),
      list: path(ROOTS_DASHBOARD, "/sales/transaction/list"),
      view: (id) => path(ROOTS_DASHBOARD, `/sales/transaction/${id}`),
    },
  },

  report: {
    root: path(ROOTS_DASHBOARD, "/report/list"),
    list: path(ROOTS_DASHBOARD, "/report/list"),
    new: path(ROOTS_DASHBOARD, "/report/new"),
    view: (id) => path(ROOTS_DASHBOARD, `/report/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/report/${id}/edit`),
    demoEdit: path(
      ROOTS_DASHBOARD,
      "/report/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit"
    ),
    demoView: path(
      ROOTS_DASHBOARD,
      "/report/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5"
    ),
  },

  settings: {
    root: path(ROOTS_DASHBOARD, "/settings/"),

    tax: {
      root: path(ROOTS_DASHBOARD, "/settings/tax/"),
      new: path(ROOTS_DASHBOARD, "/settings/tax/new"),
      view: (id) => path(ROOTS_DASHBOARD, `/settings/tax/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/settings/tax/${id}/edit`),
    },
    email: {
      root: path(ROOTS_DASHBOARD, "/settings/email/"),
      new: path(ROOTS_DASHBOARD, "/settings/email/new"),
      view: (id) => path(ROOTS_DASHBOARD, `/settings/email/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/settings/email/${id}/edit`),
    },
    currency: {
      root: path(ROOTS_DASHBOARD, "/settings/currency/"),
      new: path(ROOTS_DASHBOARD, "/settings/currency/new"),
      view: (id) => path(ROOTS_DASHBOARD, `/settings/currency/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/settings/currency/${id}/edit`),
    },
    policies: {
      root: path(ROOTS_DASHBOARD, "/settings/policies/"),
      new: path(ROOTS_DASHBOARD, "/settings/policies/new"),
      view: (id) => path(ROOTS_DASHBOARD, `/settings/policies/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/settings/policies/${id}/edit`),
    },

    notification: {
      root: path(ROOTS_DASHBOARD, "/settings/notification/"),
      new: path(ROOTS_DASHBOARD, "/settings/notification/new"),
      view: (id) => path(ROOTS_DASHBOARD, `/settings/notification/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/settings/notification/${id}/edit`),
    },
    client: {
      root: path(ROOTS_DASHBOARD, "/settings/client/"),
      new: path(ROOTS_DASHBOARD, "/settings/client/new"),
      view: (id) => path(ROOTS_DASHBOARD, `/settings/client/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/settings/client/${id}/edit`),
    },
    project: {
      root: path(ROOTS_DASHBOARD, "/settings/project/"),
      new: path(ROOTS_DASHBOARD, "/settings/project/new"),
      view: (id) => path(ROOTS_DASHBOARD, `/settings/project/${id}/view`),
      edit: (id) => path(ROOTS_DASHBOARD, `/settings/project/${id}/edit`),
    },
    termsAndConditions: {
      root: path(ROOTS_DASHBOARD, "/settings/terms-and-conditions/"),
      new: path(ROOTS_DASHBOARD, "/settings/terms-and-conditions/new"),
      view: (id) =>
        path(ROOTS_DASHBOARD, `/settings/terms-and-conditions/${id}/view`),
      edit: (id) =>
        path(ROOTS_DASHBOARD, `/settings/terms-and-conditions/${id}/edit`),
    },
  },
};

// customer path
// ==============================================================
export const PATH_CUSTOMER = {
  root: ROOTS_CUSTOMER,

  home: {
    root: path(ROOTS_CUSTOMER, "/home"),
  },
  product: {
    root: path(ROOTS_CUSTOMER, "/product"),
    category: path(ROOTS_CUSTOMER, "/product/category"),
    category1: path(ROOTS_CUSTOMER, "/product/category1"),
    subcategory1: path(ROOTS_CUSTOMER, "/product/subcategory1"),
    subcategory2: path(ROOTS_CUSTOMER, "/product/subccategory2"),
    subcategory3: path(ROOTS_CUSTOMER, "/product/subcategory3"),
    subcategory4: path(ROOTS_CUSTOMER, "/product/subcategory4"),
    detail: (name) => path(ROOTS_CUSTOMER, `/product/${name}/detail`),
    checkout: path(ROOTS_DASHBOARD, "/product/checkout"),
  },
  manufacturer: {
    root: path(ROOTS_CUSTOMER, "/manufacturer"),
    manufacturer: path(ROOTS_CUSTOMER, "/manufacturer/manufacturer"),
    manufacturer1: path(ROOTS_CUSTOMER, "/manufacturer/manufacturer1"),
    submanufacturer1: path(ROOTS_CUSTOMER, "/manufacturer/submanufacturer1"),
    submanufacturer2: path(ROOTS_CUSTOMER, "/manufacturer/subcmanufacturer2"),
    submanufacturer3: path(ROOTS_CUSTOMER, "/manufacturer/submanufacturer3"),
    submanufacturer4: path(ROOTS_CUSTOMER, "/manufacturer/submanufacturer4"),
  },
  contact: {
    root: path(ROOTS_CUSTOMER, "/contact"),
  },
  login: {
    root: path(ROOTS_CUSTOMER, "/login"),
    login: path(ROOTS_CUSTOMER, "/login"),
    register: path(ROOTS_CUSTOMER, "/register"),
    loginUnprotected: path(ROOTS_CUSTOMER, "/login-unprotected"),
    registerUnprotected: path(ROOTS_CUSTOMER, "/register-unprotected"),
    verify: path(ROOTS_CUSTOMER, "/verify"),
    resetPassword: path(ROOTS_CUSTOMER, "/reset-password"),
    newPassword: path(ROOTS_CUSTOMER, "/new-password"),
  },

  cart: {
    root: path(ROOTS_CUSTOMER, "/cart"),
    checkout: path(ROOTS_CUSTOMER, "/cart/checkout"),
  },
  user: {
    root: path(ROOTS_CUSTOMER, "/user/list"),
    new: path(ROOTS_CUSTOMER, "/user/new"),
    list: path(ROOTS_CUSTOMER, "/user/list"),
    cards: path(ROOTS_CUSTOMER, "/user/cards"),
    profile: path(ROOTS_CUSTOMER, "/user/profile"),
    account: path(ROOTS_CUSTOMER, "/user/account"),
    edit: (name) => path(ROOTS_CUSTOMER, `/user/${name}/edit`),
    demoEdit: path(ROOTS_CUSTOMER, `/user/reece-chung/edit`),
  },
  order: {
    root: path(ROOTS_CUSTOMER, "/order/list"),
    new: path(ROOTS_CUSTOMER, "/order/new"),
    list: path(ROOTS_CUSTOMER, "/order/list"),
    cards: path(ROOTS_CUSTOMER, "/order/cards"),
    view: (name) => path(ROOTS_CUSTOMER, `/order/${name}/view`),
    history: path(ROOTS_CUSTOMER, "/order/history"),
    account: path(ROOTS_CUSTOMER, "/order/account"),
    edit: (name) => path(ROOTS_CUSTOMER, `/order/${name}/edit`),
    demoEdit: path(ROOTS_CUSTOMER, `/order/reece-chung/edit`),
  },
};
// ===================================================

export const PATH_DOCS = {
  root: "https://docs.minimals.cc",
  changelog: "https://docs.minimals.cc/changelog",
};

export const PATH_ZONE_ON_STORE =
  "https://mui.com/store/items/zone-landing-page/";

export const PATH_MINIMAL_ON_STORE =
  "https://mui.com/store/items/minimal-dashboard/";

export const PATH_FREE_VERSION =
  "https://mui.com/store/items/minimal-dashboard-free/";

export const PATH_FIGMA_PREVIEW =
  "https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1";
