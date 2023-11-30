import { Loadable, lazy } from "src/routes/utils";

export const InventryListPage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/item/InventryListPage"))
);

export const InventryCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/item/InventryCreatePage"))
);

export const InventryItemViewPage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/InventryItemViewPage"))
);

export default {
  path: "item",
  children: [
    {
      element: <InventryListPage />,
      index: true,
    },

    {
      path: "component",
      element: <InventryCreatePage />,
    },

    {
      path: ":inventryItemId/edit",
      element: <InventryCreatePage />,
    },
    {
      path: ":inventryItemId/view",
      element: <InventryItemViewPage />,
    },
  ],
};
