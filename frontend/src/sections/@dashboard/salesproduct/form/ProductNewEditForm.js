import PropTypes from "prop-types";
import { useState, useMemo, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// mock
import { _purchaseAddressFrom } from "../../../../_mock/arrays";
// components
import FormProvider from "../../../../components/hook-form";
//
import ProductNewEditDetails from "./ProductNewEditDetails";
import InventryNewEditAddress from "./ProductNewEditAddress";
import InventryNewEditStatusDate from "./ProductNewEditStatusDate";
import { Api } from "src/utils";
import apiUrls from "src/routes/apiUrls";

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPurchase: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentPurchase }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);
  const [productData, setProductData] = useState({});
  
  const NewUserSchema = Yup.object().shape({
    createDate: Yup.string().nullable().required("Create date is required"),
    dueDate: Yup.string().nullable().required("Due date is required"),
    purchaseTo: Yup.mixed().nullable().required("Purchase to is required"),
  });

  const defaultValues = useMemo(
    () => ({
      purchaseNumber: currentPurchase?.purchaseNumber || "17099",
      createDate: currentPurchase?.createDate || new Date(),
      dueDate: currentPurchase?.dueDate || null,
      taxes: currentPurchase?.taxes || 0,
      status: currentPurchase?.status || "draft",
      discount: currentPurchase?.discount || 0,
      purchaseFrom: currentPurchase?.purchaseFrom || _purchaseAddressFrom[0],
      purchaseTo: currentPurchase?.purchaseTo || null,
      items: currentPurchase?.items || [
        {
          title: "",
          description: "",
          service: "",
          quantity: 1,
          price: 0,
          total: 0,
        },
      ],
      totalPrice: currentPurchase?.totalPrice || 0,
    }),
    [currentPurchase]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentPurchase) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentPurchase]);


  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);
    Api.put(apiUrls.sales.product.update(id), data)
      .then((res) => {
        if (res.result) {
          reset();
          setLoadingSend(false);

          window.Toast(res.message);
          navigate(PATH_DASHBOARD.sales.order);
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((err) => console.log(err.message));
  };


  return (
    <FormProvider methods={methods}>
      <Card>
       

        <ProductNewEditDetails   data={productData}/>
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <LoadingButton
          color="error"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={() => {
            handleSubmit(handleCreateAndSend)
            navigate(PATH_DASHBOARD.sales.product.root);
          }}
        >
          Close
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
