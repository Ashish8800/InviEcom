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
import VendorNewEditForm from "../../../../sections/@dashboard/vendor/form/VendorNewEditForm";

// ----------------------------------------------------------------------

export default function VendorItemCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>Vendor: {id ? "Update Vendor" : "Create a new Vendor"} </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Edit Vendor" : "Add Vendor"}
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
              name: "New Vendor",
            },
          ]}
        />

        <VendorNewEditForm isEdit={id ? true : false} />
      </Container>
    </>
  );
}
