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
import QuotationViewForm from "src/sections/@dashboard/purchase/quotation/form/QuotationViewForm";
// ----------------------------------------------------------------------

export default function QuotationCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isEdit = id ? true : false;
  const isView = id ? true : false;

  return (
    <>
      <Helmet>
        <title>View Quotation</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading=" View Quotation "
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Quotation",
              href: PATH_DASHBOARD.purchase.quotation.root,
            },
            {
              name: "View Quotation",
            },
          ]}
        />

        <QuotationViewForm isView={isEdit} id={id} />
      </Container>
    </>
  );
}
