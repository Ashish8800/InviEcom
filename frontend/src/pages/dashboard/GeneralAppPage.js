import { Helmet } from "react-helmet-async";
// @mui
import { useTheme } from "@mui/material/styles";
import { Container, Grid } from "@mui/material";
// auth
// _mock_
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from "../../_mock/arrays";
// components
import { useSettingsContext } from "../../components/settings";
// sections
import {
  AppWelcome,
  ItemWidgetSummary,
  TableWidgetSummary,
  AppNewInvoice,
} from "../../sections/@dashboard/general/app";
// assets
import { SeoIllustration } from "../../assets/illustrations";
import { AnalyticsWidgetSummary } from "../../sections/@dashboard/general/analytics";
import { BankingWidgetSummary } from "../../sections/@dashboard/general/banking";
import { adminName } from "src/auth/utils";
import { Api } from "src/utils";
import apiUrls from "src/routes/apiUrls";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const [orderStatusReport, setOrderStatusReport] = useState({
    packed: 0,
    shipped: 0,
    delivered: 0,
    invoiced: 0,
  });

  const [myApprovalBucket, setMyApprovalBucket] = useState([]);
  const [salesReport, setSalesReport] = useState({
    lastMonthSale: 0,
    currentMonthSale: 0,
    dailySale: [],
  });
  const [purchaseReport, setPurchaseReport] = useState({
    lastMonthPurchase: 0,
    currentMonthPurchase: 0,
    dailyPurchase: [],
  });
  const [itemStatus, setItemStatus] = useState([
    {
      key: "Low Stock Items",
      value: 0,
    },
    {
      key: "Ordered Items",
      value: 0,
    },
    {
      key: "Receiving Due Items",
      value: 0,
    },
  ]);
  const [purchaseStatus, setPurchaseStatus] = useState([
    {
      key: "PR Approval Pending",
      value: 0,
    },
    {
      key: "PO Generation Pending",
      value: 0,
    },
    {
      key: "PO Approval Pending",
      value: 0,
    },
    {
      key: "Invoice Generation Pending",
      value: 0,
    },
    {
      key: "Invoice Approval Pending",
      value: 0,
    },
  ]);

  useEffect(() => {
    Api.get(apiUrls.dashboard.order_status_report).then((res) => {
      if (res.result) setOrderStatusReport(res.data);
    }).catch(err => console.log(err));

    Api.get(apiUrls.dashboard.my_approval_bucket).then((res) => {
      if (res.result) setMyApprovalBucket(res.data);
    }).catch(err => console.log(err));

    Api.get(apiUrls.dashboard.purchase_status_report).then((res) => {
      if (res.result) setPurchaseStatus(res.data);
    }).catch(err => console.log(err));

    Api.get(apiUrls.dashboard.item_status_report).then((res) => {
      if (res.result) setItemStatus(res.data);
    }).catch(err => console.log(err));

    Api.get(apiUrls.dashboard.sales_report).then((res) => {
      if (res.result) setSalesReport(res.data);
    }).catch(err => console.log(err));

    Api.get(apiUrls.dashboard.purchase_report).then((res) => {
      if (res.result) setPurchaseReport(res.data);
    }).catch (err => console.log(err));
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "xl"}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${adminName()}`}
              // description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 250,
                    // margin: { xs: "auto", md: "inherit" },
                  }}
                />
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TableWidgetSummary
              title="Item Status"
              color="info"
              data={itemStatus}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ pt: 2 }}>
          <Grid item xs={12} md={4}>
            <BankingWidgetSummary
              title="Sales"
              icon={
                ((salesReport.currentMonthSale - salesReport.lastMonthSale) /
                  salesReport.lastMonthSale) *
                  100 >
                0
                  ? "eva:diagonal-arrow-right-up-fill"
                  : "eva:diagonal-arrow-right-down-fill"
              }
              percent={
                ((salesReport.currentMonthSale - salesReport.lastMonthSale) /
                  salesReport.lastMonthSale) *
                100
              }
              total={salesReport.currentMonthSale ?? 0}
              chart={{
                series: salesReport.dailySale ?? [],
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <BankingWidgetSummary
              title="Purchases"
              color="warning"
              icon={
                purchaseReport.lastMonthPurchase == 0
                  ? 100
                  : ((purchaseReport.currentMonthPurchase -
                      purchaseReport.lastMonthPurchase) /
                      purchaseReport.lastMonthPurchase) *
                      100 >
                    0
                  ? "eva:diagonal-arrow-right-up-fill"
                  : "eva:diagonal-arrow-right-down-fill"
              }
              percent={
                purchaseReport.lastMonthPurchase == 0
                  ? 100
                  : ((purchaseReport.currentMonthPurchase -
                      purchaseReport.lastMonthPurchase) /
                      purchaseReport.lastMonthPurchase) *
                    100
              }
              total={purchaseReport.currentMonthPurchase}
              chart={{
                series: purchaseReport.dailyPurchase ?? [],
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TableWidgetSummary
              data={purchaseStatus}
              title="Purchase Status"
              color="info"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ pt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="To Be Packed"
              total={orderStatusReport.packed}
              // icon="ant-design:android-filled"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="To Be Shipped"
              total={orderStatusReport.shipped}
              color="info"
              // icon="ant-design:apple-filled"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="To Be Delivered"
              total={orderStatusReport.delivered}
              color="warning"
              // icon="ant-design:windows-filled"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="To Be Invoiced"
              total={orderStatusReport.invoiced}
              color="error"
              // icon="ant-design:bug-filled"
            />
          </Grid>
        </Grid>

        {myApprovalBucket.length > 0 && (
          <Grid item xs={12} lg={12} sx={{ pt: 2 }}>
            <AppNewInvoice
              title="My Approval Bucket"
              tableData={myApprovalBucket}
              tableLabels={[
                { id: "id", label: "id", align: "left" },
                { id: "type", label: "Type", align: "left" },
                { id: "amount", label: "Amount", align: "left" },
                { id: "date", label: "Requested Date", align: "left" },
              ]}
            />
          </Grid>
        )}
      </Container>
    </>
  );
}
