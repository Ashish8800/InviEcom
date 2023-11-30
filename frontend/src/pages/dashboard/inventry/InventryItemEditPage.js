import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import { useSettingsContext } from "../../../components/settings";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
// sections
import InventryNewEditForm from "../../../sections/@dashboard/inventry/form/InventryNewEditForm";

// ----------------------------------------------------------------------

export default function PurchaseCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Inventry: Create a new Item </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="New Item"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Items",
              href: PATH_DASHBOARD.inventory.list,
            },
            {
              name: "New Item",
            },
          ]}
        />

        <InventryNewEditForm />
      </Container>
    </>
  );
}
