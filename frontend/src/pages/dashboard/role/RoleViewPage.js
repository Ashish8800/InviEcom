import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import { useSettingsContext } from "../../../components/settings";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
// sections
import RoleViewForm from "./RoleViewForm";
import { useParams } from "react-router";

// ----------------------------------------------------------------------

export default function RoleViewPage() {
  const { themeStretch } = useSettingsContext();

  const { roleId } = useParams();

  const isEdit = roleId ? true : false;
  const isView = roleId ? true : false;

  return (
    <>
      <Helmet>
        <title> Role</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="View Role"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Roles",
              href: PATH_DASHBOARD.userManagement.role.list,
            },

            {
              name: "View Role",
            },
          ]}
        />
        <RoleViewForm isEdit={isEdit} />
      </Container>
    </>
  );
}
