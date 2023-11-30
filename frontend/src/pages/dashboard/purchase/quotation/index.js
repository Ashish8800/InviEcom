import { Loadable, lazy } from "src/routes/utils";

export const QuotationListPage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/quotation/QuotationListPage"))
);
export const QuotationCreatePage = Loadable(
  lazy(() =>
    import("src/pages/dashboard/purchase/quotation/QuotationCreatePage")
  )
);

export const QuotationViewPage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/quotation/QuotationViewPage"))
);

export default {
  path: "quotation",
  children: [
    { element: <QuotationListPage />, index: true },
    {
      path: "new",
      element: <QuotationCreatePage />,
    },
    {
      path: ":id/edit",
      element: <QuotationCreatePage />,
    },
    {
      path: ":id",
      element: <QuotationViewPage />,
    },
  ],
};
