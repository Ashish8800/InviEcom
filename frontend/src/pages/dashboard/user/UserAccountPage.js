import { useState } from "react";
import { Helmet } from "react-helmet-async";
// @mui
import { Box, Container, Tab, Tabs } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// _mock_
import {
  _userAddressBook,
  _userInvoices,
  _userPayment,
} from "../../../_mock/arrays";
// components
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import Iconify from "../../../components/iconify";
import { useSettingsContext } from "../../../components/settings";
// sections
import Currency from "src/pages/dashboard/settings/currency/Currency";
import AccountTax from "src/pages/dashboard/settings/tax/AccountTax";
import Email from "src/pages/dashboard/settings/email/Email";
import { AccountNotifications } from "../../../sections/@dashboard/user/account";

import Client from "src/pages/dashboard/settings/client/Client.js";
import Policy from "src/pages/dashboard/settings/policy/Policy.js";
import Project from "src/pages/dashboard/settings/project/Project.js";

// ----------------------------------------------------------------------

export default function UserAccountPage() {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState("tax");

  const TABS = [];

  if (window.checkPermission("settings.tax.read")) {
    TABS.push({
      value: "tax",
      label: "Tax",
      icon: <Iconify icon="ic:round-receipt" />,
      component: (
        <AccountTax
          cards={_userPayment}
          addressBook={_userAddressBook}
          invoices={_userInvoices}
        />
      ),
    });
  }
  if (window.checkPermission("settings.email.read")) {
    TABS.push({
      value: "email",
      label: "Email",
      icon: <Iconify icon="eva:email-fill" />,
      component: <Email />,
    });
  }
  if (window.checkPermission("settings.currency.read")) {
    TABS.push({
      value: "currency",
      label: "Currency",
      icon: <Iconify icon="ic:round-receipt" />,
      component: <Currency />,
    });
  }
  if (window.checkPermission("settings.policies.read")) {
    TABS.push({
      value: "policies",
      label: "Policies",
      icon: <Iconify icon="eva:email-fill" />,
      component: <Policy />,
    });
  }
  TABS.push({
    value: "notification",
    label: "Notifications",
    icon: <Iconify icon="eva:bell-fill" />,
    component: <AccountNotifications />,
  });
  TABS.push({
    value: "client",
    label: "Clients",
    icon: <Iconify icon="ic:round-account-box" />,
    component: <Client />,
  });
  TABS.push({
    value: "project",
    label: "Project",
    icon: <Iconify icon="ic:round-receipt" />,
    component: <Project />,
  });

  return (
    <>
      <Helmet>
        <title> User: Account Settings</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Settings"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Settings", href: PATH_DASHBOARD.settings.root },
            { name: "Account Settings" },
          ]}
        />

        <Tabs
          value={currentTab}
          onChange={(event, newValue) => setCurrentTab(newValue)}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  );
}
