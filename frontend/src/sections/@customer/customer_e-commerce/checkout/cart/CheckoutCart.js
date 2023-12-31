import PropTypes from "prop-types";
import sum from "lodash/sum";
import { Link as RouterLink } from "react-router-dom";
// @mui
import { Grid, Card, Button, CardHeader, Typography } from "@mui/material";
// routes
import { PATH_CUSTOMER, PATH_DASHBOARD } from "../../../../../routes/paths";
// components
import Iconify from "../../../../../components/iconify";
import EmptyContent from "../../../../../components/empty-content";
//
import CheckoutSummary from "../CheckoutSummary";
import CheckoutCartProductList from "./CheckoutCartProductList";

// ----------------------------------------------------------------------

CheckoutCart.propTypes = {
  cart: PropTypes.object,
  onNextStep: PropTypes.func,
  onDeleteCart: PropTypes.func,
  onApplyDiscount: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
};

export default function CheckoutCart({
  cart,
  onNextStep,
  onApplyDiscount,
  onDeleteCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) {
  const { products, total, discount, subtotal } = cart;

  const totalItems = sum(products.map((item) => item.quantity));

  const isEmptyCart = !products.length;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Cart
                <Typography component="span" sx={{ color: "text.secondary" }}>
                  &nbsp;({totalItems} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {!isEmptyCart ? (
            <CheckoutCartProductList
              products={products}
              onDelete={onDeleteCart}
              onIncreaseQuantity={onIncreaseQuantity}
              onDecreaseQuantity={onDecreaseQuantity}
            />
          ) : (
            <EmptyContent
              title="Cart is empty"
              description="Look like you have no items in your shopping cart."
              img="/assets/illustrations/illustration_empty_cart.svg"
            />
          )}
        </Card>

        <Button
          to={PATH_CUSTOMER.product.root}
          component={RouterLink}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Continue Shopping
        </Button>
      </Grid>

      <Grid item xs={12} md={4}>
        <CheckoutSummary
          enableDiscount
          total={total}
          discount={discount}
          subtotal={subtotal}
          onApplyDiscount={onApplyDiscount}
        />
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={!products.length}
          onClick={onNextStep}
        >
          Check Out
        </Button>
      </Grid>
    </Grid>
  );
}
