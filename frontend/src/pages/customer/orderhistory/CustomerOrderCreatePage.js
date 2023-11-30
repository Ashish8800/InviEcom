import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_CUSTOMER } from "../../../routes/paths";
// components
import { useSettingsContext } from "../../../components/settings";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
// sections
import OrderNewEditForm from "../../../sections/@customer/customerorder/form/OrderNewEditForm";

// ----------------------------------------------------------------------

export default function CustomerOrderCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Order Details </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Order Details"
          links={[
            { name: "Home", href: PATH_CUSTOMER.home.root },
            { name: "Order", href: PATH_CUSTOMER.order.history },
            {
              name: "Order Details",
            },
          ]}
        />

        <OrderNewEditForm />
      </Container>
    </>
  );
}
