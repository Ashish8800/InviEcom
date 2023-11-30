import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../../routes/paths";
// components
import FormProvider from "../../../../../components/hook-form";
//
import { ViewGuard } from "src/auth/MyAuthGuard";
import PurchaseOrder from "src/controller/purchase/PurchaseOrder.controller";
import OrderViewDetails from "./OrderViewDetails";
// ----------------------------------------------------------------------

PurchaseOrderViewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentPurchase: PropTypes.object,
  id: PropTypes.string,
};

export default function PurchaseOrderViewForm({ isEdit, id, isView }) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);
  const [purchaseOrder, setPurchaseOrder] = useState({});

  const PurchaseRequestSchema = Yup.object().shape({
    purchaseRequest: Yup.string()
      .nullable()
      .required("Choose purchase request"),
    vendor: Yup.string().nullable().required("Vendor is required"),
    poApprover: Yup.string()
      .nullable()
      .required("Purchase Order Approver is required"),
  });
  const defaultValues = {
    purchaseRequest: "",
    vendor: "",
    poApprover: "",
  };

  const methods = useForm({
    resolver: yupResolver(PurchaseRequestSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSaveAsDraft = async (data) => {
    reset();
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.purchase.order.root);
  };

  useEffect(() => {
    PurchaseOrder.get(id)
      .then((res) => {
        setPurchaseOrder(res);
        reset({
          id: res.id,
          vendor: res.vendor,
          purchaseRequest: res.purchaseRequest,
          poApprover: res.poApprover,
          status: "pending",
        });
      })
      .catch((err) => console.log(err));
  }, []);
  const handleEdit = () => {
    console.log("handleEditRow", id);
    navigate(PATH_DASHBOARD.purchase.order.edit(id));
  };
  return (
    <FormProvider methods={methods}>
      <Card>
        <OrderViewDetails po={purchaseOrder} />
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <ViewGuard permission="purchase.purchase_order.update">
          <LoadingButton
            size="large"
            variant="contained"
            loading={loadingSend && isSubmitting}
            // onClick={handleSubmit(handleCreateAndSend)}
            onClick={handleEdit}
          >
            Edit
          </LoadingButton>
        </ViewGuard>

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
