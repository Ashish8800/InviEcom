import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// components
import { useSettingsContext } from "../../../../components/settings";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
// sections
import InvoiceNewEditForm from "src/sections/@dashboard/purchase/purchaseinvoice/form/InvoiceNewEditForm";
import { useParams } from "react-router";

// ----------------------------------------------------------------------

export default function InvoiceItemCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title> Invoice: Create a new Invoice </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Edit Invoice" : "Add Invoice"}
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
              name: "New Invoice",
            },
          ]}
        />

        <InvoiceNewEditForm />
      </Container>
    </>
  );
}
