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
import PurchaseOrderNewEditForm from "../../../../sections/@dashboard/purchase/order/form";
// ----------------------------------------------------------------------

export default function PurchaseCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isEdit = id ? true : false;

  return (
    <>
      <Helmet>
        <title> Purchases: Create a PO </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Edit PO Generation" : "PO Generation (BI)"}
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
              name: "PO Generation",
            },
          ]}
        />

        <PurchaseOrderNewEditForm isEdit={isEdit} id={id} />
      </Container>
    </>
  );
}
