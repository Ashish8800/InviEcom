// routes
import { PATH_DASHBOARD } from "./routes/paths";

// API
// ----------------------------------------------------------------------

export const HOST_API_KEY = process.env.REACT_APP_HOST_API_KEY || "";

export const FIREBASE_API = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const COGNITO_API = {
  userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  clientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
};

export const AUTH0_API = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
};

export const MAP_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.general.app; // as '/dashboard/app'

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  H_MOBILE: 64,
  H_MAIN_DESKTOP: 88,
  H_DASHBOARD_DESKTOP: 92,
  H_DASHBOARD_DESKTOP_OFFSET: 92 - 32,
};

export const NAV = {
  W_BASE: 260,
  W_DASHBOARD: 280,
  W_DASHBOARD_MINI: 88,
  //
  H_DASHBOARD_ITEM: 48,
  H_DASHBOARD_ITEM_SUB: 36,
  //
  H_DASHBOARD_ITEM_HORIZONTAL: 32,
};

export const ICON = {
  NAV_ITEM: 24,
  NAV_ITEM_HORIZONTAL: 22,
  NAV_ITEM_MINI: 22,
};

export const MODULE_PERMISSIONS = {
  dashboard: {
    dashboard: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
  },
  inventory: {
    item: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    composite_item: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    warehouse: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    category: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    stock: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
  },
  purchase: {
    vendor: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    purchase_request: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    rfq: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    quotation: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    purchase_order: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    invoice: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    purchase_receive: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
  },
  sales: {
    customer: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    products: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    orders: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    transaction: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
  },
  users_and_roles: {
    users: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    roles: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
  },
  settings: {
    tax: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    currency: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    email: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    policies: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    notification: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    client: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    project: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    termsAndConditions: {
      read: false,
      create: false,
      update: false,
      delete: false,
    },
  },
};

export const SOCIAL_LINKS = {
  FACEBOOK: process.env.REACT_APP_SOCIAL_MEDIA_LINK_FACEBOOK ?? "#",
  LINKEDIN: process.env.REACT_APP_SOCIAL_MEDIA_LINK_LINKEDIN ?? "#",
  INSTAGRAM: process.env.REACT_APP_SOCIAL_MEDIA_LINK_INSTAGRAM ?? "#",
  TWITTER: process.env.REACT_APP_SOCIAL_MEDIA_LINK_TWITTER ?? "#",
};

export const REQUESTED_SOURCE = [
  "phone",
  "email",
  "call",
  "whatsapp",
  "oral",
  "others",
];

export const STYLED_SCROLLBAR_SX = {
  "& div::-webkit-scrollbar": {
    width: "5px",
  },
  "& div::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "& div::-webkit-scrollbar-thumb": {
    background: "#888",
    "border-radius": "10px",
  },
  "& div::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
};

export const REMOVE_SCROLLBAR_SX = {
  "& div::-webkit-scrollbar": {
    display: "none",
  },
};
