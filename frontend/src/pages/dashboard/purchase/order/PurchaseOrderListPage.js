import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// @mui
import { Box, Button, Card, Container, Tab, Tabs } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// _mock_
// components
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import Iconify from "../../../../components/iconify";
import { useSettingsContext } from "../../../../components/settings";
// sections
import { ViewGuard } from "src/auth/MyAuthGuard";
import Label from "src/components/label/Label";
import PurchaseOrderApprovalList from "src/sections/@dashboard/purchase/order/list/PurchaseOrderApprovalList";
import PurchaseOrderCorrectionList from "src/sections/@dashboard/purchase/order/list/PurchaseOrderCorrectionList";
import PurchaseOrderVerificationList from "src/sections/@dashboard/purchase/order/list/PurchaseOrderVerificationList";
import PurchaseOrderGeneralList from "../../../../sections/@dashboard/purchase/order/list/PurchaseOrderGeneralList";

// ----------------------------------------------------------------------

export default function PurchaseListPage() {
  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("general");
  const [statistics, setStatistics] = useState({
    general: 0,
    correction: 0,
    verification: 0,
    approval: 0,
  });
  const TABS = [
    {
      value: "general",
      label: "General",
      color: "info",
      count: statistics.general,
    },
    {
      value: "correction",
      label: "Correction ",
      color: "info",
      count: statistics.correction,
    },
    {
      value: "verification",
      label: "Verification Request",
      count: statistics.verification,
      color: "error",
    },
    {
      value: "approval",
      label: "Approval Request",
      color: "info",
      count: statistics.approval,
    },
  ];

  const handleRowCount = (tab, count) => {
    console.log(tab, count);
    const new_statistics = { ...statistics, tab: count };
    console.log(new_statistics);
    setStatistics(new_statistics);
  };

  return (
    <ViewGuard permission="purchase.purchase_order.read" page={true}>
      <Helmet>
        <title> Purchase Order</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Purchase Order"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Purchase", href: PATH_DASHBOARD.purchase.root },
            { name: "Order" },
          ]}
          action={
            <ViewGuard permission="purchase.purchase_order.create">
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.purchase.order.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Purchase Order
              </Button>
            </ViewGuard>
          }
        />

        <Card>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              px: 2,
            }}
          >
            <Tab
              label="General"
              value="general"
              iconPosition="end"
              icon={
                <Label variant="filled" color="info" sx={{ mr: 1 }}>
                  {statistics.general}
                </Label>
              }
            />
            <Tab
              label="Correction"
              value="correction"
              iconPosition="end"
              icon={
                <Label variant="filled" color="error" sx={{ mr: 1 }}>
                  {statistics.correction}
                </Label>
              }
            />
            <Tab
              label="Verification Request"
              value="verification"
              iconPosition="end"
              icon={
                <Label variant="filled" color="warning" sx={{ mr: 1 }}>
                  {statistics.verification}
                </Label>
              }
            />

            <Tab
              label="Approval Request"
              value="approval"
              iconPosition="end"
              icon={
                <Label variant="filled" color="success" sx={{ mr: 1 }}>
                  {statistics.approval}
                </Label>
              }
            />
          </Tabs>

          <Box>
            {currentTab === "general" && (
              <PurchaseOrderGeneralList onRowCount={handleRowCount} />
            )}
            {currentTab === "correction" && (
              <PurchaseOrderCorrectionList onRowCount={handleRowCount} />
            )}

            {currentTab === "verification" && (
              <PurchaseOrderVerificationList onRowCount={handleRowCount} />
            )}
            {currentTab === "approval" && (
              <PurchaseOrderApprovalList onRowCount={handleRowCount} />
            )}
          </Box>
        </Card>
      </Container>
    </ViewGuard>
  );
}

// ----------------------------------------------------------------------
