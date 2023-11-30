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
import PurchaseNewEditForm from "src/sections/@dashboard/purchase/request/form/PurchaseNewEditForm";
// ----------------------------------------------------------------------

export default function PurchaseCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isEdit = id ? true : false;

  return (
    <>
      <Helmet>
        <title> PR Request: Create new PR Request </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={isEdit ? "Edit PR Request" : "Add PR Request"}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "PR Request",
              href: PATH_DASHBOARD.purchase.request.root,
            },
            {
              name: isEdit ? "Edit PR Request" : "Add PR Request",
            },
          ]}
        />

        <PurchaseNewEditForm isEdit={isEdit} id={id} />
      </Container>
    </>
  );
}
