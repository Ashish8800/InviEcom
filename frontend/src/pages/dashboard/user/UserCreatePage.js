import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import { useSettingsContext } from "../../../components/settings";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
// sections
import UserNewEditForm from "../../../sections/@dashboard/user/UserNewEditForm";
import { useParams } from "react-router";

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { userId } = useParams();

  const isEdit = userId ? true : false;

  return (
    <>
      <Helmet>
        <title> {isEdit ? "Update User" : "Add User"}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={isEdit ? "Update User" : "Add User"}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "User",
              href: PATH_DASHBOARD.userManagement.user.list,
            },
            { name: isEdit ? "Update User" : "Add User" },
          ]}
        />
        <UserNewEditForm isEdit={isEdit} userId={userId} />
      </Container>
    </>
  );
}
