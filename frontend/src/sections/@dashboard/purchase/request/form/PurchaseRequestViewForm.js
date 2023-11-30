import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// mock
// components
import { adminId } from "src/auth/utils";

import FormProvider from "src/components/hook-form";
//
import { ViewGuard } from "src/auth/MyAuthGuard";
import PurchaseRequest from "src/controller/purchase/PurchaseRequest.controller";
import PurchaseRequestViewDetails from "./PurchaseRequestViewDetails";
// ----------------------------------------------------------------------

PurchaseRequestViewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  id: PropTypes.string,
};

export default function PurchaseRequestViewForm({ isEdit, id, isView }) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const PurchaseRequestSchema = Yup.object().shape({
    title: Yup.string()
      .nullable()
      .required("Purchase request title is required"),
  });

  const defaultValues = {
    items: [],
    discount: 0,
    taxes: 0,
    indentor: adminId(),
    requestSource: "",
    requestSourceDetails: "",
    indentor: "",
    clientId: "",
    projectId: "",
    deliverTo: "",
    description: "",
    deliveryDate: "",
    total: 0,
    prApprover: "",
    files: [],
     ipn:"",
    mpn: "",
    manufacturer: "",
  };

  const methods = useForm({
    defaultValues,
  });

 const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  useEffect(() => {
    if (isView) {
      reset(defaultValues);

      PurchaseRequest.get(id)
        .then((res) => {
          let fieldsValue = {
            ...defaultValues,
            ...res,
            indentor: res.indentorId,
          };

          reset(fieldsValue);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleSaveAsDraft = () => {
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.purchase.request.root);
  };

  const handleEdit = () => {
    navigate(PATH_DASHBOARD.purchase.request.edit(id));
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <PurchaseRequestViewDetails />
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <ViewGuard permission="purchase.purchase_request.update">
          {values.status == "pending" && (
            <LoadingButton
              size="large"
              variant="contained"
              loading={loadingSend && isSubmitting}
              onClick={handleEdit}
            >
              Edit
            </LoadingButton>
          )}
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
