import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
// @mui
import { Grid, Container } from "@mui/material";
// routes
import { PATH_CUSTOMER } from "../../../routes/paths";
// redux
import { useDispatch, useSelector } from "../../../redux/store";
import {
  resetCart,
  getCart,
  nextStep,
  backStep,
  gotoStep,
  deleteCart,
  createBilling,
  createShipping,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  paymentMode,
} from "../../../redux/slices/cart";
// components
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../components/settings";
// sections
import {
  CheckoutCart,
  CheckoutSteps,
  CheckoutPayment,
  CheckoutOrderComplete,
  CheckoutBillingAddress,
} from "../../../sections/@customer/customer_e-commerce/checkout";
import CheckoutOrderCancel from "src/sections/@customer/customer_e-commerce/checkout/CheckoutOrderCancel";
import { Api, isLoggedIn } from "src/utils";
import apiUrls from "src/routes/apiUrls";
import { customerId, isCustomerLoggedIn } from "src/auth/utils";

// ----------------------------------------------------------------------

const STEPS = ["Cart", "Billing & address", "Payment"];

// ----------------------------------------------------------------------

export default function CustomerCheckoutPage() {
  const navigate = useNavigate();

  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [order, setOrder] = useState({});

  const { activeStep, products, billingAddress, shippingAddress } = cart;

  const completed = activeStep === STEPS.length;

  const handleNextStep = () => {
    if (isCustomerLoggedIn()) {
      dispatch(nextStep());
    } else {
      window.openLoginModel();
    }
  };

  const handleBackStep = () => {
    dispatch(backStep());
  };

  const handleGotoStep = (step) => {
    dispatch(gotoStep(step));
  };

  const handleApplyDiscount = (value) => {
    if (products.length) {
      dispatch(applyDiscount(value));
    }
  };

  const handleDeleteCart = (productId) => {
    dispatch(deleteCart(productId));
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleCreateBilling = (address) => {
    dispatch(createBilling(address));
  };

  const handleCreateShipping = (address) => {
    dispatch(createShipping(address));
  };

  const handleApplyShipping = (value) => {
    dispatch(applyShipping(value));
  };

  const handleReset = () => {
    if (completed) {
      dispatch(resetCart());
    }
  };

  const handlePaymentChange = (mode) => {
    dispatch(paymentMode(mode));
  };

  const handleOrderComplete = (data) => {
    setOrder(data);
    handleNextStep();
    handleReset();
  };
  const handleOrderCancel = (data) => {
    setOrder(data);
    handleNextStep();
    handleReset();
  };

  useEffect(() => {
    if (isCustomerLoggedIn()) {
      Api.get(apiUrls.customer.get(customerId()))
        .then((res) => {
          if (res.result) {
            if (billingAddress == null) {
              dispatch(
                createBilling({
                  name: res?.data?.firstName + res?.data?.lastName,
                  mobile: res?.data?.mobile,
                  address: res?.data?.billing?.address,
                  city: res?.data?.billing?.city,
                  state: res?.data?.billing?.state,
                  country: res?.data?.billing?.country,
                })
              );
            }
            if (shippingAddress == null) {
              dispatch(
                createShipping({
                  name: res?.data?.firstName + res?.data?.lastName,
                  mobile: res?.data?.mobile,
                  address: res?.data?.shipping?.address,
                  city: res?.data?.shipping?.city,
                  state: res?.data?.shipping?.state,
                  country: res?.data?.shipping?.country,
                })
              );
            }
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      <Helmet>
        <title> Checkout | InviEcom</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Checkout"
          links={[
            { name: "Home", href: PATH_CUSTOMER.home.root },
            {
              name: "Product",
              href: PATH_CUSTOMER.product.root,
            },
            { name: "Checkout" },
          ]}
        />

        <Grid container justifyContent={completed ? "center" : "flex-start"}>
          <Grid item xs={12} md={8}>
            <CheckoutSteps activeStep={activeStep} steps={STEPS} />
          </Grid>
        </Grid>

        {completed ? (
          // <CheckoutOrderComplete
          //   order={order}
          //   open={completed}
          //   onReset={handleReset}
          //   onDownloadPDF={() => {
          //     window.ToastError(
          //       "Sorry, currently pdf not available for download"
          //     );
          //   }}
          // />
          <CheckoutOrderCancel
            order={order}
            open={completed}
            onReset={handleReset}
            onDownloadPDF={() => {
              window.ToastError(
                "Sorry, currently pdf not available for download"
              );
            }}
          />
        ) : (
          <>
            {activeStep === 0 && (
              <CheckoutCart
                cart={cart}
                onNextStep={handleNextStep}
                onDeleteCart={handleDeleteCart}
                onApplyDiscount={handleApplyDiscount}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
              />
            )}
            {activeStep === 1 && (
              <CheckoutBillingAddress
                cart={cart}
                onBackStep={handleBackStep}
                onNextStep={handleNextStep}
                onCreateBilling={handleCreateBilling}
                onCreateShipping={handleCreateShipping}
              />
            )}
            {activeStep === 2 && billingAddress && (
              <CheckoutPayment
                cart={cart}
                onNextStep={handleNextStep}
                onBackStep={handleBackStep}
                onGotoStep={handleGotoStep}
                onApplyShipping={handleApplyShipping}
                onCreateBilling={handleCreateBilling}
                onPaymentChange={handlePaymentChange}
                onReset={handleReset}
                onOrderComplete={handleOrderComplete}
                onOrderCancel={handleOrderCancel}
              />
            )}
          </>
        )}
      </Container>
    </>
  );
}
