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
import RFQForm from "src/sections/@dashboard/purchase/rfq/form/RFQForm";
// ----------------------------------------------------------------------

export default function RFQCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { id, rfqId } = useParams();

  return (
    <>
      <Helmet>
        <title> Request For Quotation </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={rfqId ? "Edit RFQ" : " Generate Request For Quotation "}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "RFQ",
              href: PATH_DASHBOARD.purchase.rfq.root,
            },
            {
              name: "Generate RFQ",
            },
          ]}
        />

        <RFQForm isEdit={rfqId ? true : false} id={id} rfqId={rfqId} />
      </Container>
    </>
  );
}
