const API_HOST =
  process.env.REACT_APP_API_HOST ?? "http://115.246.101.18:5000/api/";

function path(sublink) {
  return `${API_HOST}${sublink}`;
}

const apiUrls = {
  auth: {
    admin: {
      login: path("auth/admin/login"),
    },
  },

  dashboard: {
    purchase_status_report: path("dashboard/purchase/status"),
    item_status_report: path("dashboard/item/status"),
    order_status_report: path("dashboard/order/status"),
    my_approval_bucket: path("dashboard/my-approval-bucket"),
    sales_report: path("dashboard/sales-report"),
    purchase_report: path("dashboard/purchase-report"),
  },

  inventory: {
    item: {
      index: path("inventory/item/"),
      create: path("inventory/item/"),
      get: (id) => path(`inventory/item/${id}/`),
      update: (id) => path(`inventory/item/${id}/`),
      delete: (id) => path(`inventory/item/${id}/`),
    },

    warehouse: {
      index: path("inventory/warehouse/"),
      create: path("inventory/warehouse/"),
      get: (id) => path(`inventory/warehouse/${id}/`),
      update: (id) => path(`inventory/warehouse/${id}/`),
      delete: (id) => path(`inventory/warehouse/${id}/`),
    },
    stock: {
      index: path("inventory/stock/"),
      create: path("inventory/stock/"),
      stockList: path("inventory/stock/"),
      get: (id) => path(`inventory/stock/${id}/`),
      update: (id) => path(`inventory/stock/${id}/`),
      delete: (id) => path(`inventory/stock/${id}/`),
    },

    category: {
      index: path("inventory/category/"),
      create: path("inventory/category/"),
      get: (id) => path(`inventory/category/${id}/`),
      update: (id) => path(`inventory/category/${id}/`),
      delete: (id) => path(`inventory/category/${id}/`),
    },

    subcategory: {
      index: path("inventory/subcategory/"),
      create: path("inventory/subcategory/"),
      get: (id) => path(`inventory/subcategory/${id}/`),
      update: (id) => path(`inventory/subcategory/${id}/`),
      delete: (id) => path(`inventory/subcategory/${id}/`),
    },

    manufacture: {
      index: path("inventory/manufacture/"),
      create: path("inventory/manufacture/"),
      get: (id) => path(`inventory/manufacture/${id}/`),
      update: (id) => path(`inventory/manufacture/${id}/`),
      delete: (id) => path(`inventory/manufacture/${id}/`),
    },
  },

  userManagement: {
    user: {
      index: path("user-management/user"),
      create: path("user-management/user"),
      get: (id) => path(`user-management/user/${id}/`),
      update: (id) => path(`user-management/user/${id}/`),
      delete: (id) => path(`user-management/user/${id}/`),
      forgetPassword: path(`user-management/user/reset-password`),
      changePassword: path(`user-management/user/change-password`),
      updatePassword: (id) =>
        path(`user-management/user/${id}/change-password`),
    },

    role: {
      index: path("user-management/role"),
      create: path("user-management/role"),
      get: (id) => path(`user-management/role/${id}/`),
      update: (id) => path(`user-management/role/${id}/`),
      delete: (id) => path(`user-management/role/${id}/`),
    },
  },

  settings: {
    email: {
      index: path("settings/email/"),
      create: path("settings/email/"),
      get: (id) => path(`settings/email/${id}/`),
      update: (id) => path(`settings/email/${id}/`),
      delete: (id) => path(`settings/email/${id}/`),
    },
    tax: {
      index: path("settings/gst/"),
      update: path(`settings/gst/`),
      addTax: path("settings/gst/tax/"),
      updateTax: (id) => path(`settings/gst/tax/${id}/`),
      delete: (id) => path(`settings/gst/tax/${id}/`),
    },

    currency: {
      index: path("settings/currency/"),
      create: path("settings/currency/"),
      get: (id) => path(`settings/currency/${id}/`),
      update: (id) => path(`settings/currency/${id}/`),
      delete: (id) => path(`settings/currency/${id}/`),
    },
    policy: {
      index: path("settings/policy/"),
      create: path("settings/policy/"),
      get: (id) => path(`settings/policy/${id}/`),
      update: (id) => path(`settings/policy/${id}/`),
      delete: (id) => path(`settings/policy/${id}/`),
    },
    termsAndCondition: {
      index: path("settings/terms-and-condition/"),
      create: path("settings/terms-and-condition/"),
      get: (id) => path(`settings/terms-and-condition/${id}/`),
      update: (id) => path(`settings/terms-and-condition/${id}/`),
      delete: (id) => path(`settings/terms-and-condition/${id}/`),
    },
  },

  purchase: {
    vendor: {
      index: path("purchase/vendor/"),
      create: path("purchase/vendor/"),
      get: (id) => path(`purchase/vendor/${id}/`),
      update: (id) => path(`purchase/vendor/${id}/`),
      delete: (id) => path(`purchase/vendor/${id}/`),
    },

    rfq: {
      index: path("purchase/rfq/"),
      create: path("purchase/rfq/"),
      get: (id) => path(`purchase/rfq/${id}/`),
      update: (id) => path(`purchase/rfq/${id}/`),
      status: (id) => path(`purchase/rfq/${id}/status`),
      delete: (id) => path(`purchase/rfq/${id}/`),
      sendMail: (id) => path(`purchase/rfq/${id}/send-mail`),
    },
    quotation: {
      index: path("purchase/quotation/"),
      create: path("purchase/quotation/"),
      get: (id) => path(`purchase/quotation/${id}/`),
      update: (id) => path(`purchase/quotation/${id}/`),
      delete: (id) => path(`purchase/quotation/${id}/`),
    },
    client: {
      index: path("purchase/client/"),
      create: path("purchase/client/"),
      get: (id) => path(`purchase/client/${id}/`),
      update: (id) => path(`purchase/client/${id}/`),
      delete: (id) => path(`purchase/client/${id}/`),
    },
    project: {
      index: path("purchase/project/"),
      create: path("purchase/project/"),
      get: (id) => path(`purchase/project/${id}/`),
      update: (id) => path(`purchase/project/${id}/`),
      delete: (id) => path(`purchase/project/${id}/`),
    },
    request: {
      index: path("purchase/request/"),
      create: path("purchase/request/"),
      get: (id) => path(`purchase/request/${id}/`),
      update: (id) => path(`purchase/request/${id}/`),
      delete: (id) => path(`purchase/request/${id}/`),
      withdraw: (id) => path(`purchase/request/${id}/withdraw`),
      changeStatus: (id, status) => path(`purchase/request/${id}/${status}`),
    },
    order: {
      index: path("purchase/order/"),
      create: path("purchase/order/"),
      get: (id) => path(`purchase/order/${id}/`),
      update: (id) => path(`purchase/order/${id}/`),
      delete: (id) => path(`purchase/order/${id}/`),
    },
    invoice: {
      index: path("purchase/invoice/"),
      create: path("purchase/invoice/"),
      get: (id) => path(`purchase/invoice/${id}/`),
      update: (id) => path(`purchase/invoice/${id}/`),
      delete: (id) => path(`purchase/invoice/${id}/`),
    },
    receive: {
      index: path("purchase/receive/"),
      create: path("purchase/receive/"),
      get: (id) => path(`purchase/receive/${id}/`),
      update: (id) => path(`purchase/receive/${id}/`),
      delete: (id) => path(`purchase/receive/${id}/`),
    },
  },

  website: {
    contact: path("web/contact"),

    product: path("web/product"),
    category: path("web/category"),
    auth: {
      register: path("web/auth/register"),

      login: path("web/auth/login"),
      verify: path("web/auth/verify"),
      resendOtp: path("web/auth/resend-otp"),
      forgetPassword: path("web/auth/forget-password"),
      changePassword: path("web/auth/change-password"),
    },
  },
  customer: {
    index: path("customer/profile"),
    list: (id) => path(`customer/profile/${id}/`),
    get: (id) => path(`customer/profile/${id}/`),
    update: (id) => path(`customer/profile/${id}/`),
    changePassword: path(`customer/profile/change-password/`),
    cart: {
      get: (id) => path(`customer/cart/${id}/`),
      update: (id) => path(`customer/cart/${id}/`),
    },
    order: {
      index: path("customer/order"),
      get: (id) => path(`customer/order/${id}`),
      cancel: (id) => path(`customer/order/${id}/cancel`),
      update: (id) => path(`customer/order/${id}/update`),
      create: path("customer/order"),
    },
  },
};

export default apiUrls;
