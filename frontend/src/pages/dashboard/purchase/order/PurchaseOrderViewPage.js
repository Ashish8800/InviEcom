import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// components
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
// sections
import { useParams } from "react-router";
import PurchaseOrderViewForm from "src/sections/@dashboard/purchase/order/form/PurchaseOrderViewForm";
// ----------------------------------------------------------------------

export default function PurchaseOrderViewPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isView = id ? true : false;

  return (
    <>
      <Helmet>
        <title> Purchases: View purchase </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="View Purchase Order"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Purchases",
              href: PATH_DASHBOARD.purchase.request.root,
            },
            {
              name: "Order",
              href: PATH_DASHBOARD.purchase.order.root,
            },
            {
              name: "Purchase Order",
            },
          ]}
        />

        <PurchaseOrderViewForm isView={isView} id={id} />
      </Container>
    </>
  );
}
