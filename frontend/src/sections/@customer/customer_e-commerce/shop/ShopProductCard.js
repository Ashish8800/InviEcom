import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
// @mui
import { Box, Card, Link, Stack, Fab } from "@mui/material";
// routes
// utils
// redux
import { useDispatch } from "../../../../redux/store";
import { addToCart } from "../../../../redux/slices/cart";
// components
import Iconify from "../../../../components/iconify";
import Image from "../../../../components/image";
import { formateCurrency } from "src/utils";
import { PATH_CUSTOMER } from "src/routes/paths";
import { isCustomerLoggedIn } from "src/auth/utils";
import { is } from "date-fns/locale";

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { id, name, thumbnail: cover, priceSale } = product;

  let price = product?.saleData?.price ?? 0;

  const dispatch = useDispatch();

  const linkTo = PATH_CUSTOMER.product.detail(id);

  const handleAddCart = async () => {
    // if (!isCustomerLoggedIn()) {
    //   window.openLoginModel();
    //   return false;
    // }

    let availableStock = 0;
    product?.warehouses?.forEach((item) => {
      availableStock += item.currentStock ?? 0;
    });

    const newProduct = {
      id,
      name,
      cover,
      available: availableStock,
      price,
      quantity: 1,
    };

    try {
      dispatch(addToCart(newProduct));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      sx={{
        "&:hover .add-cart-btn": {
          opacity: 1,
        },
      }}
    >
      <Box sx={{ position: "relative", p: 1 }}>
        {/* {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )} */}

        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: "absolute",
            transition: (theme) =>
              theme.transitions.create("all", {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="ic:round-add-shopping-cart" />
        </Fab>

        <Image alt={name} src={cover} ratio="1/1" sx={{ borderRadius: 1.5 }} />
      </Box>

      <Stack spacing={2.5} sx={{ p: 3 }}>
        <Link
          component={RouterLink}
          to={linkTo}
          color="inherit"
          variant="subtitle2"
          noWrap
        >
          {name}
        </Link>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={0.5} sx={{ typography: "subtitle1" }}>
            {priceSale && (
              <Box
                component="span"
                sx={{ color: "text.disabled", textDecoration: "line-through" }}
              >
                {formateCurrency(priceSale)}
              </Box>
            )}

            <Box component="span">{formateCurrency(price)}</Box>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
