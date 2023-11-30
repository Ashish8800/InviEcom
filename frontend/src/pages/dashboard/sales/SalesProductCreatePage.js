import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import { useSettingsContext } from "../../../components/settings";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
// sections
import ProductNewEditForm from "../../../sections/@dashboard/salesproduct/form/ProductNewEditForm";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Api } from "src/utils";
import apiUrls from "src/routes/apiUrls";
// ----------------------------------------------------------------------

export default function SalesProductCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const [productData, setProductData] = useState({});

  useEffect(() => {
    Api.get(apiUrls.inventory.item.get(id))
      .then((res) => {
        if (res.result) {
          
          setProductData(res.data);
        } else {
          window.ToastError(res.message);
        }
      })

      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Helmet>
        {/* <title> {productData?.name} | Product Details</title> */}
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={productData?.name}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Product",
              href: PATH_DASHBOARD.sales.product.list,
            },
            {
              name:productData?.name
            },
          ]}
        />

        <ProductNewEditForm id={id ?? ""} />
      </Container>
    </>
  );
}
