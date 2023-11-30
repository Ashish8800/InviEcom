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
import Client from "src/controller/purchase/Client.controller";
import PurchaseOrder from "src/controller/purchase/PurchaseOrder.controller";
import PurchaseOrderPreview from "../PurchaseOrderPreview";
import POCorrectionDetails from "./POCorrectionDetails";
// ----------------------------------------------------------------------

POCorrectionForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPurchase: PropTypes.object,
  id: PropTypes.string,
};

export default function POCorrectionForm({ isEdit, id }) {
  const navigate = useNavigate();

  const [orderOpen, setOrderOpen] = useState(false);
  const [orderFormData, setOrderFormData] = useState("");

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const PurchaseRequestSchema = Yup.object().shape({
    purchaseRequest: Yup.string()
      .nullable()
      .required("Choose purchase request"),
    poCorrectionComment: Yup.string()
      .nullable()
      .required("Comment is required"),
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

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    delete data.totalPrice;
    delete data.items;

    if (data.id) {
      PurchaseOrder.update(data)
        .then((res) => {
          console.log(data);
          reset();
          setLoadingSave(false);
          window.Toast("Purchase order updated successfully");
          navigate(PATH_DASHBOARD.purchase.order.root);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      PurchaseOrder.create(data)
        .then((res) => {
          reset();
          setLoadingSave(false);
          window.Toast("Purchase order created successfully");
          navigate(PATH_DASHBOARD.purchase.order.root);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleOrderOpen = () => {
    setOrderOpen(true);
    setOrderFormData(false);
  };

  const handleOrderClose = () => {
    Client.list()
      .then((result) => {
        result = result.reverse();
      })
      .catch((error) => console.log(error));

    setOrderFormData("");
    setOrderOpen(false);
  };

  useEffect(() => {
    PurchaseOrder.get(id)
      .then((res) => {
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

  return (
    <FormProvider methods={methods}>
      <Card>
        <POCorrectionDetails />
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleOrderOpen}
        >
          Preview PO
        </LoadingButton>

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          Submit For Verification
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

      {/* Purchase Order Dialog */}

      <PurchaseOrderPreview
        open={orderOpen}
        data={orderFormData}
        onClose={handleOrderClose}
        isDialog={true}
      />
    </FormProvider>
  );
}
