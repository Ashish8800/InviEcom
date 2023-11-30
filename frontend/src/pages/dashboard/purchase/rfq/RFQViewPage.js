import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// components
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { useSettingsContext } from "src/components/settings";
// sections
import { useParams } from "react-router";
import PurchaseRequestViewForm from "src/sections/@dashboard/purchase/request/form/PurchaseRequestViewForm";
// ----------------------------------------------------------------------

export default function RFQViewPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isEdit = id ? true : false;
  const isView = id ? true : false;

  return (
    <>
      <Helmet>
        <title> Purchases: View purchase </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="View PR Request"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Purchase Requests",
              href: PATH_DASHBOARD.purchase.request.root,
            },
            {
              name: " Purchase Request",
            },
          ]}
        />

        <PurchaseRequestViewForm isView={isEdit} id={id} />
      </Container>
    </>
  );
}
