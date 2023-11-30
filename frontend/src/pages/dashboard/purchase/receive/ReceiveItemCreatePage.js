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
import ReceiveNewEditForm from "../../../../sections/@dashboard/purchase/receive/form/ReceiveNewEditForm";

// ----------------------------------------------------------------------

export default function ReceiveItemCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title> Receive: Create a new Receive </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Edit Purchase Receive" : "Add Purchase Receive"}
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
              name: "Receive",
              href: PATH_DASHBOARD.purchase.receive.root,
            },
            {
              name: "New Purchase Receive",
            },
          ]}
        />

        <ReceiveNewEditForm />
      </Container>
    </>
  );
}
