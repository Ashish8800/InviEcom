import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import { useSettingsContext } from "../../../components/settings";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
// sections
// import InventryCompositeNewEditForm from "../../../sections/@dashboard/inventrycomposite/form/InventryCompositeNewEditForm";
import { useParams } from "react-router";
// ----------------------------------------------------------------------

export default function PurchaseCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { compositeItemId } = useParams();

  console.log(compositeItemId);
  return (
    <>
      <Helmet>
        <title> Inventry: Create a new Composite Item </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={
            compositeItemId ? "Edit Composite Item" : "Add Composite Item"
          }
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Composite Items",
              href: PATH_DASHBOARD.inventory.list,
            },
            {
              name: "New Item",
            },
          ]}
        />

        {/* <InventryCompositeNewEditForm /> */}
      </Container>
    </>
  );
}
