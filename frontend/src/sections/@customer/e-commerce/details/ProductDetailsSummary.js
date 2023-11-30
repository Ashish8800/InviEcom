import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { sentenceCase } from "change-case";
import { useNavigate } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
// @mui
import { Box, Stack, Button, Divider, Typography } from "@mui/material";
// routes
// utils
// _mock
// components
import Iconify from "../../../../components/iconify";
import { IncrementerButton } from "../../../../components/custom-input";
import FormProvider from "../../../../components/hook-form";
import { PATH_CUSTOMER } from "src/routes/paths";
import { formateCurrency } from "src/utils";
import { isCustomerLoggedIn } from "src/auth/utils";
import Label from "src/components/label/Label";
import { async } from "q";
// ----------------------------------------------------------------------

ProductDetailsSummary.propTypes = {
  cart: PropTypes.array,
  onAddCart: PropTypes.func,
  product: PropTypes.object,
  onGotoStep: PropTypes.func,
};

export default function ProductDetailsSummary({
  cart,
  product,
  onAddCart,
  onGotoStep,
  ...other
}) {
  const navigate = useNavigate();

  const [available, setAvailable] = useState(0);
  const { id, name, thumbnail: cover } = product;

  let price = product?.saleData?.price ?? 0;

  const methods = useForm({
    defaultValues: {
      quantity: 1,
    },
  });
  const { watch, setValue, handleSubmit } = methods;

  const values = watch();

  const onSubmit = async (data) => {
      try {
        onAddCart({
          ...data,
          id,
          name,
          cover,
          price,
          available,
        });
        window.Toast(`${name} added to your cart`);
      } catch (error) {
        console.error(error);
      }
   
  };

  const handleBuyNow = async (data) => {
    if (isCustomerLoggedIn()) {
      try {
        onAddCart({
          ...data,
          id,
          name,
          cover,
          price,
          available,
        });
        navigate(PATH_CUSTOMER.cart.root);
      } catch (error) {
        console.error(error);
      }
    } else {
      window.openLoginModel();
    }
  };

  useEffect(() => {
    let availableStock = 0;
    product?.warehouses?.forEach((item) => {
      availableStock += item.currentStock ?? 0;
    });
    setAvailable(availableStock);
  }, [product]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack
        spacing={3}
        sx={{
          p: (theme) => ({
            md: theme.spacing(5, 5, 0, 2),
          }),
        }}
        {...other}
      >
        <Stack spacing={2}>
          <Label
            variant="soft"
            color={available > 0 ? "success" : "error"}
            sx={{ textTransform: "uppercase", mr: "auto" }}
          >
            {sentenceCase(available > 0 ? "In stock" : "Out of stock")}
          </Label>

          <Typography variant="h5">{name}</Typography>

          <Typography variant="h4">
            {product && (
              <Box
                component="span"
                sx={{
                  color: "text.disabled",
                  textDecoration: "line-through",
                  mr: 0.5,
                }}
              >
                {/* {formateCurrency(3000)} */}
              </Box>
            )}

            {formateCurrency(product?.saleData?.price ?? 0)}
          </Typography>
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography paragraph>SKU</Typography>
            <Typography>
              {product.sku && product.sku != "" ? product.sku : "-"}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography paragraph>MPN</Typography>
            <Typography>
              {product.mpn && product.mpn != "" ? product.mpn : "-"}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography paragraph>ISBN</Typography>
            <Typography>
              {product.isbn && product.isbn != "" ? product.isbn : "-"}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography paragraph>EAN</Typography>
            <Typography>
              {product.ean && product.ean != "" ? product.ean : "-"}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography paragraph>UPC</Typography>
            <Typography>
              {product.upc && product.upc != "" ? product.upc : "-"}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography paragraph>Factory Lead Time</Typography>
            <Typography>1 Day</Typography>
          </Stack>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography
            variant="subtitle2"
            sx={{ height: 36, lineHeight: "36px" }}
          >
            Quantity
          </Typography>

          <Stack spacing={1}>
            <IncrementerButton
              name="quantity"
              quantity={values.quantity}
              disabledDecrease={values.quantity <= 1}
              disabledIncrease={values.quantity >= available}
              onIncrease={() => setValue("quantity", values.quantity + 1)}
              onDecrease={() => setValue("quantity", values.quantity - 1)}
            />

            <Typography
              variant="caption"
              component="div"
              sx={{ textAlign: "right", color: "text.secondary" }}
            >
              Available: {available}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />
        <Stack direction="row" spacing={2} sx={{ pb: 5 }}>
          <Button
            fullWidth
            disabled={false}
            size="large"
            color="warning"
            variant="contained"
            startIcon={<Iconify icon="ic:round-add-shopping-cart" />}
            type="submit"
            sx={{ whiteSpace: "nowrap" }}
          >
            Add to Cart
          </Button>

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={handleSubmit(handleBuyNow)}
          >
            Buy Now
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
