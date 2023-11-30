import PropTypes from "prop-types";
import { useState, useMemo, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// mock
import { _purchaseAddressFrom } from "../../../_mock/arrays";
// components
import FormProvider from "../../../components/hook-form";
//
// import PurchaseNewEditDetails from './PurchaseNewEditDetails';
// import PurchaseNewEditAddress from './PurchaseNewEditAddress';
// import PurchaseNewEditStatusDate from './PurchaseNewEditStatusDate';

// ----------------------------------------------------------------------

ItemNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPurchase: PropTypes.object,
};

export default function ItemNewEditForm({ isEdit, currentPurchase }) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentPurchase]);

  const handleSaveAsDraft = async (data) => {
    reset();
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.sales.customer.root);
  };

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      setLoadingSend(false);
      navigate(PATH_DASHBOARD.sales.customer.root);
      console.log("DATA", JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setLoadingSend(false);
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        {/* <PurchaseNewEditAddress />

        <PurchaseNewEditStatusDate /> */}

        {/* <PurchaseNewEditDetails /> */}
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        {/* <LoadingButton
          color="inherit"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </LoadingButton> */}

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {isEdit ? "Update" : "Add"}
        </LoadingButton>

        <LoadingButton
          color="error"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Cancel
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
