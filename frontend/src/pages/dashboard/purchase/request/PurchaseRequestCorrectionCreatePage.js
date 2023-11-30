import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// components
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { useSettingsContext } from "src/components/settings";
// sections
import PurchaseRequestCorrectionForm from "src/sections/@dashboard/purchase/request/form/PurchaseRequestCorrectionForm";
// ----------------------------------------------------------------------

export default function PurchaseRequestCorrectionCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Purchases Request Correction </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={"PR Request Correction"}
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
              name: "PR Request Correction",
            },
          ]}
        />

        <PurchaseRequestCorrectionForm />
      </Container>
    </>
  );
}
