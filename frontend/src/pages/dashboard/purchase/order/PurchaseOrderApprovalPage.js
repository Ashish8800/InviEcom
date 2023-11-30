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
import OrderApprovalNewEditForm from "src/sections/@dashboard/purchase/order/form/OrderApprovalNewEditForm.js";
// ----------------------------------------------------------------------

export default function OrderApprovalCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const isEdit = id ? true : false;

  return (
    <>
      <Helmet>
        <title> Purchase Order Approval </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="PO Approval"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },

            {
              name: "Order",
              href: PATH_DASHBOARD.purchase.order.root,
            },
            {
              name: "PO Approval ",
            },
          ]}
        />

        <OrderApprovalNewEditForm isEdit={isEdit} id={id} />
      </Container>
    </>
  );
}
