import { Loadable, lazy } from "src/routes/utils";

export const VendorListPage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/vendor/VendorListPage"))
);
export const VendorItemCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/vendor/VendorItemCreatePage"))
);
// export const VendorEditPage = Loadable(
//   lazy(() => import("src/pages/dashboard/purchase/VendorEditPage"))
// );
export const VendorViewPage = Loadable(
  lazy(() => import("src/pages/dashboard/purchase/vendor/VendorViewPage"))
);

export default {
  path: "vendor",
  children: [
    { element: <VendorListPage />, index: true },
    {
      path: "new",
      element: <VendorItemCreatePage />,
    },
    {
      path: ":id/edit",
      element: <VendorItemCreatePage />,
    },
    {
      path: ":id/view",
      element: <VendorViewPage />,
    },
  ],
};
