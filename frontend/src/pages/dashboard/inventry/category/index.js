import { Loadable, lazy } from "src/routes/utils";


export const CategoryListPage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/category/CategoryListPage"))
);

export default 
{ path: "Category", element: <CategoryListPage /> }