import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Grid,
  Divider,
  Container,
  Typography,
  Stack,
} from "@mui/material";

// redux
import { useDispatch } from "src/redux/store";
import { addToCart, gotoStep } from "src/redux/slices/cart";
// routes
import { PATH_CUSTOMER } from "src/routes/paths";
// components
import Markdown from "src/components/markdown";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { useSettingsContext } from "src/components/settings";
// sections
import {
  ProductDetailsSummary,
  ProductDetailsCarousel,
} from "src/sections/@customer/e-commerce/details";

import { ShopProductList } from "src/sections/@customer/customer_e-commerce/shop";
import Item from "src/controller/inventory/Item.controller";
import { Api } from "src/utils";
import apiUrls from "src/routes/apiUrls";


// ----------------------------------------------------------------------

export default function ProductDetailPage() {
  const { themeStretch } = useSettingsContext();

  let { productId } = useParams();
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);

  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState("description");

  const handleAddCart = (newProduct) => {
    dispatch(addToCart(newProduct));
  };

  const handleGotoStep = (step) => {
    dispatch(gotoStep(step));
  };

  const TABS = [
    {
      value: "description",
      label: "description",
      component: product ? <Markdown children={product?.description} /> : null,
    },
  ];

  useEffect(() => {
    Item.get(productId)
      .then((res) => setProduct(res))
      .catch((err) => console.log(err));
  }, [productId]);

  useEffect(() => {
    if (product.category) {
      Api.get(
        `${apiUrls.website.product}?category=${product.category[0].id}`
      ).then((res) => {
        if (res.result) {
          setProducts(res.data);
        }
      });
    }
  }, [product]);

  return (
    <>
      <Helmet>
        <title>{`Product: ${product?.name || ""} `}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Product Details"
          links={[
            { name: "Home", href: PATH_CUSTOMER.home.root },
            {
              name: "Product",
              href: PATH_CUSTOMER.product.root,
            },
            { name: product?.name },
          ]}
        />

        {product && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={7}>
                <ProductDetailsCarousel product={product} />
              </Grid>

              <Grid item xs={12} md={6} lg={5}>
                <ProductDetailsSummary
                  product={product}
                  onAddCart={handleAddCart}
                  onGotoStep={handleGotoStep}
                />
              </Grid>
            </Grid>

            <Card>
              <Tabs
                value={currentTab}
                onChange={(event, newValue) => setCurrentTab(newValue)}
                sx={{ px: 3, bgcolor: "background.neutral" }}
              >
                {TABS.map((tab) => (
                  <Tab key={tab.value} value={tab.value} label={tab.label} />
                ))}
              </Tabs>

              <Divider />

              {TABS.map(
                (tab) =>
                  tab.value === currentTab && (
                    <Box
                      key={tab.value}
                      sx={{
                        ...(currentTab === "description" && {
                          p: 3,
                        }),
                      }}
                    >
                      {tab.component}
                    </Box>
                  )
              )}
            </Card>
            <Grid container>
              <Grid item xs={12} md={12}>
                <Stack sx={{ p: 2 }}>
                  <Typography variant="h6">You might also like </Typography>
                </Stack>
                <ShopProductList
                  products={products}
                  loading={!products.length}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}
