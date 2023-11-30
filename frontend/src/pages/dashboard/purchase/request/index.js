import { Loadable, lazy } from "src/routes/utils";

export const PurchaseRequestListPage = Loadable(
  lazy(() => import("./PurchaseRequestListPage"))
);

export const PurchaseCreatePage = Loadable(
  lazy(() => import("./PurchaseCreatePage"))
);

export const PurchaseRequestViewPage = Loadable(
  lazy(() => import("./PurchaseRequestViewPage"))
);

export const PurchaseRequestApprovalCreatePage = Loadable(
  lazy(() => import("./PurchaseRequestApprovalCreatePage"))
);

export const PurchaseRequestCorrectionCreatePage = Loadable(
  lazy(() => import("./PurchaseRequestCorrectionCreatePage"))
);

export default {
  path: "request",
  children: [
    { element: <PurchaseRequestListPage />, index: true },
    {
      path: "new",
      element: <PurchaseCreatePage />,
    },
    {
      path: ":id/edit",
      element: <PurchaseCreatePage />,
    },
    {
      path: ":id/view",
      element: <PurchaseRequestViewPage />,
    },
    {
      path: ":id/approval",
      element: <PurchaseRequestApprovalCreatePage />,
    },
    {
      path: ":id/correction",
      element: <PurchaseRequestCorrectionCreatePage />,
    },
  ],
};
