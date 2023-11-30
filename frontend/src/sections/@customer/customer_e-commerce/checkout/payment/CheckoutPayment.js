import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Grid, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../../../components/iconify";
import FormProvider from "../../../../../components/hook-form";
//
import CheckoutSummary from "../CheckoutSummary";
import CheckoutDelivery from "./CheckoutDelivery";
import CheckoutBillingInfo from "./CheckoutBillingInfo";
import CheckoutPaymentMethods from "./CheckoutPaymentMethods";
import { useEffect } from "react";
import CustomerOrder from "src/controller/customer/CustomerOrder.controller";
import { customerId } from "src/auth/utils";

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    value: 0,
    title: "Standard delivery (Free)",
    description: "Delivered on Monday, August 12",
  },
  // {
  //   value: 2,
  //   title: "Fast delivery ($2,00)",
  //   description: "Delivered on Monday, August 5",
  // },
];

const PAYMENT_OPTIONS = [
  {
    value: "paypal",
    title: "Pay with Paypal",
    description:
      "You will be redirected to PayPal website to complete your purchase securely.",
    icons: ["/assets/icons/payments/ic_paypal.svg"],
  },
  {
    value: "paytm",
    title: "Pay with Paytm",
    description:
      "You will be redirected to Paytm website to complete your purchase securely.",
    icons: ["/assets/icons/payments/ic_paytm.svg"],
  },
  // {
  //   value: "credit_card",
  //   title: "Credit / Debit Card",
  //   description: "We support Mastercard, Visa, Discover and Stripe.",
  //   icons: [
  //     "/assets/icons/payments/ic_mastercard.svg",
  //     "/assets/icons/payments/ic_visa.svg",
  //   ],
  // },
  {
    value: "cash",
    title: "Cash on Delivery",
    description: "Pay with cash when your order is delivered.",
    icons: [],
  },
];

const CARDS_OPTIONS = [
  { value: "ViSa1", label: "**** **** **** 1212 - Jimmy Holland" },
  { value: "ViSa2", label: "**** **** **** 2424 - Shawn Stokes" },
  { value: "MasterCard", label: "**** **** **** 4545 - Cole Armstrong" },
];

CheckoutPayment.propTypes = {
  onReset: PropTypes.func,
  cart: PropTypes.object,
  onBackStep: PropTypes.func,
  onGotoStep: PropTypes.func,
  onNextStep: PropTypes.func,
  onApplyShipping: PropTypes.func,
  onCreateBilling: PropTypes.func,
  onPaymentChange: PropTypes.func,
  onOrderComplete: PropTypes.func,
};

export default function CheckoutPayment({
  cart,
  onReset,
  onNextStep,
  onBackStep,
  onGotoStep,
  onApplyShipping,
  onCreateBilling,
  onPaymentChange,
  onOrderComplete,
}) {
  const { total, discount, subtotal, shipping, billingAddress, paymentMode } =
    cart;

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required("Kindly select a payment is required!"),
  });

  const defaultValues = {
    delivery: shipping,
    payment: paymentMode,
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  const values = watch();

  useEffect(() => {
    if (values.payment != paymentMode) {
      onPaymentChange(values.payment);
    }
  }, [values.payment]);

  useEffect(() => {
    setValue("payment", paymentMode);
  }, [paymentMode]);

  const onSubmit = async (data) => {
    if (cart.paymentMode == "cash") {
      CustomerOrder.create({
        ...cart,
        customerId: customerId(),
      })
        .then((res) => {
          onOrderComplete(res);
        })
        .catch((error) => window.ToastError(error.message));
    } else {
      window.ToastError(
        ` The ${cart.paymentMode} payment option is not currently available. `
      );
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutDelivery
            onApplyShipping={onApplyShipping}
            deliveryOptions={DELIVERY_OPTIONS}
          />

          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            paymentOptions={PAYMENT_OPTIONS}
            sx={{ my: 3 }}
          />

          <Button
            size="small"
            color="inherit"
            onClick={onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutBillingInfo
            title="Billing Address"
            onBackStep={onBackStep}
            onCreate={onCreateBilling}
            data={billingAddress}
          />

          <CheckoutSummary
            enableEdit
            total={total}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            onEdit={() => onGotoStep(0)}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Complete Order
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
