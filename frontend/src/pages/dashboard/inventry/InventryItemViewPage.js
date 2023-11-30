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
import InventryViewItemForm from "../../../sections/@dashboard/inventry/form/InventryViewItemForm";

// ----------------------------------------------------------------------

export default function InventryItemViewPage() {
  const { themeStretch } = useSettingsContext();

  const { inventryItemId } = useParams();

  const isEdit = inventryItemId ? true : false;
  const isView = inventryItemId ? true : false;
  


  return (
    <>
    
      <Helmet>
        <title>  Item</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="View Item"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Items",
              href: PATH_DASHBOARD.inventory.item.root,
            },
            {
              name: "Item",
            },
          ]}
        />

        <InventryViewItemForm isView={isView} id={inventryItemId ?? ""} />
      </Container>
    </>
  );
}
