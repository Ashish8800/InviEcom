import { Loadable, lazy } from "src/routes/utils";

export const StockListPage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/stock/StockListPage"))
);

export default { path: "Stock", element: <StockListPage /> };
