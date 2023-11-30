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
import OrderVerificationForm from "src/sections/@dashboard/purchase/order/form/OrderVerificationForm";
// ----------------------------------------------------------------------

export default function OrderVerificationPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const isEdit = id ? true : false;

  return (
    <>
      <Helmet>
        <title> Purchase Order Verification </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="PO Verification"
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
              name: "PO Verification ",
            },
          ]}
        />

        <OrderVerificationForm isEdit={isEdit} id={id} />
      </Container>
    </>
  );
}
