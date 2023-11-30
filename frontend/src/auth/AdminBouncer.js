/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Stack } from "@mui/system";
import { Button } from "@mui/material";
import jwt_decode from "jwt-decode";
import { getDataFromApi } from "./apiCalls";
import { sleep } from "./common.util";
import { isEmpty } from "lodash";
const { Outlet } = require("react-router-dom");

window.Buffer = window.Buffer || require("buffer").Buffer;

export function authorizedAdminOnly() {
  const token = localStorage.getItem("token") ?? "";

  if (isEmpty(token)) {
    return (window.location.href = "/login");
  } else {
    const data = jwt_decode(token);
    // return;
    if (data.status.toLowerCase() !== "active" || data.portal !== "admin") {
      return (window.location.href = "/login");
    }
  }

  return true;
}

export function authorizedUserOnly() {
  const token = localStorage.getItem("token") ?? "";

  if (isEmpty(token)) {
    window.location.href = "/login";
  } else {
    const data = jwt_decode(token);
    if (!data.emailVerified && data.portal === "customer") {
      window.location.href = "/welcomecard";
    }
  }
}

export function takeToDashboard() {
  const token = localStorage.getItem("token") ?? "";

  if (!isEmpty(token)) {
    const data = jwt_decode(token);
    if (data && data.portal == "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/dashboard/app";
    }
  }
}

export function userDetails() {
  authorizedUserOnly();
  const token = localStorage.getItem("token") ?? "";
  if (!isEmpty(token)) {
    return jwt_decode(token);
  }
  return {};
}

export function AuthorizedAdminOnlyComponent() {
  return authorizedAdminOnly() && <Outlet />;
}

export function AdminBouncer(props) {
  // fetch bouncer permission data
  const { children } = props;

  let cPer = props.permission || null;

  if (cPer && (cPer = cPer.split(".")) && cPer.length > 1) {
    let pList = retrieveAdminPermission();
    for (let i = 0; i < pList.length; i++) {
      let item = pList[i];
      if (item.moduleId == cPer[0] && item[cPer[1].toLowerCase()]) {
        return <>{children}</>;
      }
    }
  }
  return props.hasOwnProperty("page") ? <ProtectedPage></ProtectedPage> : <></>;
}

export function ClientBouncer(props) {
  const { children } = props;

  if (props.permission === "")
    return props.hasOwnProperty("page") ? (
      <ProtectedPage></ProtectedPage>
    ) : (
      <></>
    );

  return <>{children}</>;
}

export function AdminBouncerFunction(permission) {
  let cPer = permission;
  if (cPer && (cPer = cPer.split(".")) && cPer.length > 1) {
    let pList = retrieveAdminPermission();
    for (let i = 0; i < pList.length; i++) {
      let item = pList[i];
      if (item.moduleId == cPer[0] && item[cPer[1].toLowerCase()]) {
        return true;
      }
    }
  }
  return false;
}

function ProtectedPage() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999999,
        backgroundColor: "rgba(0,0,0,0.5)",
        backgroundColor: "rgba(255, 255, 255, .01)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <p>
          Forbidden Error: May be you don't have permission to see this page.
        </p>
        <Button
          size="medium"
          variant="contained"
          onClick={() => {
            window.history.back();
          }}
        >
          Go Back
        </Button>
      </Box>
    </div>
  );
}
