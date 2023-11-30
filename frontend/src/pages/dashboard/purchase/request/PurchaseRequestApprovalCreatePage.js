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
import PurchaseRequestApprovalForm from "src/sections/@dashboard/purchase/request/form/PurchaseRequestApprovalForm";
// ----------------------------------------------------------------------

export default function PurchaseCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title> Purchases Request Approval </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={`PR Request Approval   (#${id})`}
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
              name: "PR Request Approval",
            },
          ]}
        />

        <PurchaseRequestApprovalForm />
      </Container>
    </>
  );
}
