import { Loadable, lazy } from "src/routes/utils";

export const WarehouseListPage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/warehouse/WarehouseListPage"))
);

export default { path: "warehouse", element: <WarehouseListPage /> };
