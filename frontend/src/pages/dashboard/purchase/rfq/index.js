import { Loadable, lazy } from "src/routes/utils";

export const RFQListPage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/rfq/RFQListPage"))
);
export const RFQCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/rfq/RFQCreatePage"))
);
export const RFQViewPage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/rfq/RFQViewPage"))
);

export default {
  path: "rfq",
  children: [
    { element: <RFQListPage />, index: true },
    {
      path: ":id/new",
      element: <RFQCreatePage />,
    },
    {
      path: ":rfqId/edit/",
      element: <RFQCreatePage />,
    },
    {
      path: ":id/view",
      element: <RFQViewPage />,
    },
  ],
};
