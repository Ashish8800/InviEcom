import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import { useSettingsContext } from "../../../components/settings";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
// sections
import RoleNewEditForm from "./RoleNewEditForm";
import { useParams } from "react-router";

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { roleId } = useParams();

  const isEdit = roleId ? true : false;

  return (
    <>
      <Helmet>
        <title> Role: {isEdit ? "Update Role" : "Add Role"}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={isEdit ? "Update Role" : "Add Role"}
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
              name: isEdit ? "Update Role" : "Add Role",
            },
          ]}
        />
        <RoleNewEditForm isEdit={isEdit} />
      </Container>
    </>
  );
}
