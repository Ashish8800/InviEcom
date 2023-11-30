import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// mock
// components
import FormProvider from "src/components/hook-form";
//
import PurchaseInvoice from "src/controller/purchase/PurchaseInvoice.controller";
import InvoiceApprovalNewEditDetails from "./InvoiceApprovalNewEditDetails";

// ----------------------------------------------------------------------
InvoiceApprovalNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPurchase: PropTypes.object,
  id: PropTypes.string,
};

export default function InvoiceApprovalNewEditForm({
  isEdit,
  currentPurchase,
  id,
}) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const NewUserSchema = Yup.object().shape({
    invoiceApproverComment: Yup.string()
      .nullable()
      .required("Comment is a required"),
  });

  const defaultValues = {
    invoiceApproverComment: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleSaveAsDraft = () => {
    setLoadingSend(true);

    let data = values;

    let nData = {
      ...data,
      status: "rejected",
      invoiceApproverDate: new Date().toString(),
    };

    PurchaseInvoice.update(nData)
      .then((res) => {
        reset();
        setLoadingSend(false);
        navigate(PATH_DASHBOARD.purchase.invoice.root);
        window.ToastError("Purchase invoice rejected");
      })
      .catch((err) => {
        window.ToastError(err.message);
      });
  };

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);
    let nData = {
      ...data,
      status: "approved",
      invoiceApproverDate: new Date().toString(),
    };

    PurchaseInvoice.update(nData)
      .then((res) => {
        reset();
        setLoadingSend(false);
        navigate(PATH_DASHBOARD.purchase.invoice.root);
        window.Toast("Purchase invoice approved");
      })
      .catch((err) => {
        window.ToastError(err.message);
      });
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceApprovalNewEditDetails id={id} />
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
          onClick={handleSubmit(handleCreateAndSend)}
        >
          Approve
        </LoadingButton>

        <LoadingButton
          color="error"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Reject
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
