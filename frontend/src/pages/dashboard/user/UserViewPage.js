import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import { useSettingsContext } from "../../../components/settings";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
// sections
import UserViewForm from "../../../sections/@dashboard/user/UserViewForm";
import { useParams } from "react-router";

// ----------------------------------------------------------------------

export default function UserViewPage() {
  const { themeStretch } = useSettingsContext();
  const { userId } = useParams();
  const isEdit = userId ? true : false
  const isView = userId ? true : false;

  return (
    <>
      <Helmet>
        <title> View User</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading= "View User"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "User",
              href: PATH_DASHBOARD.userManagement.user.list,
            },
            { name:  " User" },
          ]}
        />
        <UserViewForm isView={isView} userId={userId} />
      </Container>
    </>
  );
}
