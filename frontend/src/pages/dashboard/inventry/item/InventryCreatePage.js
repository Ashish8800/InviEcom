import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// components
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
// sections
import InventryNewForm from "../../../../sections/@dashboard/inventry/form/InventryNewForm";

// ----------------------------------------------------------------------

export default function InventryCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { inventryItemId } = useParams();

  const isEdit = inventryItemId ? true : false;

  return (
    <>
      <Helmet>
        <title>
          {" "}
          {isEdit
            ? "Inventory: Update Component"
            : "Inventory: Create a new Component"}{" "}
        </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={isEdit ? "Edit Component" : "Add Component"}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Components",
              href: PATH_DASHBOARD.inventory.item.root,
            },
            {
              name: "New Component",
            },
          ]}
        />

        <InventryNewForm isEdit={isEdit} id={inventryItemId ?? ""} />
      </Container>
    </>
  );
}
