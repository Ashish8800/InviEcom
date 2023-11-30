import { Navigate } from "react-router";
import { Loadable, lazy } from "src/routes/utils";

export const AccountTax = Loadable(
  lazy(() => import("src/pages/dashboard/settings/tax/AccountTax"))
);
export const Email = Loadable(
  lazy(() => import("src/pages/dashboard/settings/email/Email"))
);
export const Currency = Loadable(
  lazy(() => import("src/pages/dashboard/settings/currency/Currency"))
);
export const Policy = Loadable(
  lazy(() => import("src/pages/dashboard/settings/policy/Policy"))
);
export const AccountNotifications = Loadable(
  lazy(() =>
    import("src/sections/@dashboard/user/account/AccountNotifications")
  )
);
export const Client = Loadable(
  lazy(() => import("src/pages/dashboard/settings/client/Client"))
);
export const Project = Loadable(
  lazy(() => import("src/pages/dashboard/settings/project/Project"))
);
export const TermsAndConditions = Loadable(
  lazy(() =>
    import("src/pages/dashboard/settings/termsAndCondition/TermsAndConditions")
  )
);

export default {
  path: "settings",

  children: [
    {
      element: <Navigate to="/dashboard/settings/tax" />,
      index: true,
    },
    { path: "tax", element: <AccountTax /> },
    { path: "email", element: <Email /> },
    { path: "currency", element: <Currency /> },
    { path: "policies", element: <Policy /> },
    { path: "notification", element: <AccountNotifications /> },
    { path: "client", element: <Client /> },
    { path: "project", element: <Project /> },
    { path: "terms-and-conditions", element: <TermsAndConditions /> },
  ],
};
