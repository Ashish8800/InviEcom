import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

import ViewGuardPermissionDeniedPage from "src/pages/dashboard/ViewGuardPermissionDeniedPage";
import { PATH_AUTH } from "src/routes/paths";
import { isAdminLoggedIn } from "./utils";

// ----------------------------------------------------------------------

MyAuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function MyAuthGuard({ children }) {
  const { pathname } = useLocation();

  if (!isAdminLoggedIn()) {
    return <Navigate to={`${PATH_AUTH.login}?requestedLocation=${pathname}`} />;
  }

  return <> {children} </>;
}

ViewGuard.propTypes = {
  permission: PropTypes.string,
  page: PropTypes.bool,
  children: PropTypes.node,
  orPermissions: PropTypes.array,
  andPermissions: PropTypes.array,
};

export function ViewGuard({
  permission,
  page,
  children,
  orPermissions,
  andPermissions,
}) {
  let hasViewPermission = false;
  if (
    orPermissions &&
    Array.isArray(orPermissions) &&
    orPermissions.length > 0
  ) {
    try {
      orPermissions.forEach((item) => {
        hasViewPermission =
          window.checkPermission(item) || hasViewPermission ? true : false;
      });
    } catch (err) {}
  }

  if (
    andPermissions &&
    Array.isArray(andPermissions) &&
    andPermissions.length > 0
  ) {
    try {
      andPermissions.forEach((item) => {
        hasViewPermission =
          window.checkPermission(item) && hasViewPermission ? true : false;
      });
    } catch (err) {}
  }

  if (permission) {
    hasViewPermission = window.checkPermission(permission);
  }

  if (!hasViewPermission) {
    return !page ? (
      <></>
    ) : (
      <ViewGuardPermissionDeniedPage></ViewGuardPermissionDeniedPage>
    );
  } else {
    return <> {children} </>;
  }
}
