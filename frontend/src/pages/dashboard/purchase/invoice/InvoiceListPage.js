import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// @mui
import { Box, Button, Card, Container, Tab, Tabs } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// _mock_
// components
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
// sections
import { ViewGuard } from "src/auth/MyAuthGuard";
import Label from "src/components/label/Label";
import ProformaInvoiceApprovalList from "./ProformaInvoiceApprovalList";
import ProformaInvoiceCorrectionList from "./ProformaInvoiceCorrectionList";
import ProformaInvoiceGeneralList from "./ProformaInvoiceGeneralList";
import ProformaInvoiceVerificationList from "./ProformaInvoiceVerificationList";

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: "invoiceId", label: "Invoice Id", align: "left" },
  { id: "VendorName", label: "Vendor Name", align: "left" },
  {
    id: "invoiceDate",
    label: "Invoice Date",
    align: "left",
  },

  { id: "amount", label: "Amount", align: "left" },
];

if (
  window.checkPermission("purchase.invoice.update") ||
  window.checkPermission("purchase.invoice.delete") ||
  window.checkPermission("purchase.invoice.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "right" });
}



// ----------------------------------------------------------------------

export default function InvoiceListPage() {

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
    <ViewGuard permission="purchase.invoice.read" page={true}>
      <Helmet>
        <title>Proforma Invoice: List </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Proforma Invoice"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Proforma Invoice" },
          ]}
          action={
            <ViewGuard permission="purchase.invoice.create">
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.purchase.invoice.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Proforma Invoice
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
              <ProformaInvoiceGeneralList onRowCount={handleRowCount} />
            )}
            {currentTab === "correction" && (
              <ProformaInvoiceCorrectionList onRowCount={handleRowCount} />
            )}

            {currentTab === "verification" && (
              <ProformaInvoiceVerificationList onRowCount={handleRowCount} />
            )}
            {currentTab === "approval" && (
              <ProformaInvoiceApprovalList onRowCount={handleRowCount} />
            )}
          </Box>
        </Card>
      </Container>
    </ViewGuard>
  );
}

// ----------------------------------------------------------------------
