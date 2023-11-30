import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import { useSettingsContext } from "../../../components/settings";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
// sections
import CustomerNewEditForm from "../../../sections/@dashboard/salescustomer/form/CustomerNewEditForm";

// ----------------------------------------------------------------------

export default function CustomerCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Customer </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Customer Profile"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Customer",
              href: PATH_DASHBOARD.sales.customer.root,
            },
            {
              name: "Profile",
            },
          ]}
        />

        <CustomerNewEditForm />
      </Container>
    </>
  );
}
