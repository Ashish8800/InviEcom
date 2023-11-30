import PropTypes from "prop-types";

// @mui
import { Grid, Card, Button, Typography, Stack, Box } from "@mui/material";
// _mock
import { _addressBooks } from "../../../../../_mock/arrays";
// components
import Label from "../../../../../components/label";
import Iconify from "../../../../../components/iconify";
//
import CheckoutSummary from "../CheckoutSummary";
import CheckoutShippingInfo from "src/sections/@customer/customer_e-commerce/checkout/payment/CheckoutShippingInfo.js";
import CheckoutBillingInfo from "src/sections/@customer/customer_e-commerce/checkout/payment/CheckoutBillingInfo.js";
// ----------------------------------------------------------------------

CheckoutBillingAddress.propTypes = {
  cart: PropTypes.object,
  onBackStep: PropTypes.func,
  onNextStep: PropTypes.func,
  onCreateBilling: PropTypes.func,
  onCreateShipping: PropTypes.func,
};

export default function CheckoutBillingAddress({
  cart,
  onBackStep,
  onNextStep,
  onCreateBilling,
  onCreateShipping,
}) {
  const { total, discount, subtotal, billingAddress, shippingAddress } = cart;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutBillingInfo
            title="Billing Address"
            onCreate={onCreateBilling}
            data={billingAddress}
          />

          <CheckoutBillingInfo
            title="Shipping Address"
            onCreate={onCreateShipping}
            data={shippingAddress}
          />

          <Stack direction="row" justifyContent="space-between">
            <Button
              size="small"
              color="inherit"
              onClick={onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Back
            </Button>

            <Button variant="outlined" size="small" onClick={onNextStep}>
              Next
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary
            subtotal={subtotal}
            total={total}
            discount={discount}
          />
        </Grid>
      </Grid>
    </>
  );
}
