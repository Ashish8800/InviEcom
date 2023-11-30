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
import InvoiceApprovalNewEditForm from "src/sections/@dashboard/purchase/purchaseinvoice/form/InvoiceApprovalNewEditForm";

// ----------------------------------------------------------------------

export default function InvoiceApprovalCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title> Invoice Approval Bucket </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Invoice Approval Bucket"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Purchase",
              href: PATH_DASHBOARD.purchase.request.root,
            },
            {
              name: "Invoice",
              href: PATH_DASHBOARD.purchase.invoice.root,
            },
            {
              name: "Approval",
            },
          ]}
        />

        <InvoiceApprovalNewEditForm id={id} />
      </Container>
    </>
  );
}
