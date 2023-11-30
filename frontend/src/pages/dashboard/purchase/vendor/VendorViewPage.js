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
import VendorViewForm from "../../../../sections/@dashboard/vendor/form/VendorViewForm";

// ----------------------------------------------------------------------

export default function VendorViewPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>View Vendor </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="View Vendor"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Vendor",
              href: PATH_DASHBOARD.purchase.vendor.root,
            },
            {
              name: " Vendor",
            },
          ]}
        />

        <VendorViewForm isView={id ? true : false} />
      </Container>
    </>
  );
}
