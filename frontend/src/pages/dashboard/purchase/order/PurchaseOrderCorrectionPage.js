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
import POCorrectionForm from "src/sections/@dashboard/purchase/order/form/POCorrectionForm";
// ----------------------------------------------------------------------

export default function OrderCorrectionPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isEdit = id ? true : false;

  return (
    <>
      <Helmet>
        <title> Purchases: PO Correction </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="PO Correction"
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
              name: "PO Correction",
            },
          ]}
        />

        <POCorrectionForm isEdit={isEdit} id={id} />
      </Container>
    </>
  );
}
