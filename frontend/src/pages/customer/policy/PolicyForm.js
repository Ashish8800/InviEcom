import { Helmet } from "react-helmet-async";
// @mui
import {
  Container,
  Box,
  Card,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
// _mock
import { _mapContact } from "src/_mock/arrays";
// sections
import PolicyDetails from "src/pages/customer/policy/PolicyDetails";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../components/settings";
import { PATH_CUSTOMER } from "../../../routes/paths";
import { useParams } from "react-router";
import { extractIdFromSlug } from "src/utils";
import Policy from "src/controller/settings/Policy.controller";
import { useEffect, useState } from "react";
import { convertHtmlToText, formateDate } from "src/utils";

// ----------------------------------------------------------------------

export default function ContactPage() {
  const { themeStretch } = useSettingsContext();
  const [policy, setPolicy] = useState({});
  const { slug } = useParams();
  const policyId = extractIdFromSlug(slug);

  useEffect(() => {
    Policy.get(policyId).then((res) => {
      setPolicy(res);
    });
  });

  return (
    <>
      <Helmet>
        <title> Policy</title>
      </Helmet>

      <Container sx={{ py: 10 }} maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Policy"
          links={[
            { name: "Home", href: PATH_CUSTOMER.home.root },
            { name: "Policy" },
            { name: policy.name ??"" },
          ]}
        />

        <Box>
          <Card sx={{ p: 2 }}>
            <Stack>
              <Typography variant="h6" sx={{ flexGrow: 1, m: 3 }}>
                {policy?.name ?? ""}( {formateDate(policy?.effectiveDate ?? "")}{" "}
                )
              </Typography>

              <Divider />
              <Typography sx={{ m: 3 }}>
                {" "}
                {convertHtmlToText(policy?.description ?? "")}
              </Typography>
            </Stack>
          </Card>
        </Box>
      </Container>
    </>
  );
}
