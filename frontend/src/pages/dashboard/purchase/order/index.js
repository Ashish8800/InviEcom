import { lazy, Loadable } from "src/routes/utils";

export const PurchaseOrderApprovalPage = Loadable(
  lazy(() => import("./PurchaseOrderApprovalPage"))
);
export const PurchaseOrderCorrectionPage = Loadable(
  lazy(() => import("./PurchaseOrderCorrectionPage"))
);
export const PurchaseOrderVerificationPage = Loadable(
  lazy(() => import("./PurchaseOrderVerificationPage"))
);
export const PurchaseOrderListPage = Loadable(
  lazy(() => import("./PurchaseOrderListPage"))
);
export const PurchaseOrderCreatePage = Loadable(
  lazy(() => import("./PurchaseOrderCreatePage"))
);
export const PurchaseOrderViewPage = Loadable(
  lazy(() => import("./PurchaseOrderViewPage"))
);

export default {
  path: "order",
  children: [
    { element: <PurchaseOrderListPage />, index: true },
    {
      path: "new",
      element: <PurchaseOrderCreatePage />,
    },
    {
      path: ":id/view",
      element: <PurchaseOrderViewPage />,
    },
    {
      path: ":id/edit",
      element: <PurchaseOrderCreatePage />,
    },
    {
      path: ":id/approval",
      element: <PurchaseOrderApprovalPage />,
    },
    {
      path: ":id/correction",
      element: <PurchaseOrderCorrectionPage />,
    },
    {
      path: ":id/verification",
      element: <PurchaseOrderVerificationPage />,
    },
  ],
};
