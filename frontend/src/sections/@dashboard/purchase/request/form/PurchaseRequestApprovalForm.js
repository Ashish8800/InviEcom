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
import { adminId } from "src/auth/utils";
import { PATH_DASHBOARD } from "src/routes/paths";
// components
import FormProvider from "src/components/hook-form";
//
import { useParams } from "react-router";
import PurchaseRequest from "src/controller/purchase/PurchaseRequest.controller";
import PurchaseRequestApprovalFormDetails from "./PurchaseRequestApprovalFormDetails";
// ----------------------------------------------------------------------

PurchaseRequestApprovalForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPurchase: PropTypes.object,
};

export default function PurchaseRequestApprovalForm({
  isEdit,
  currentPurchase,
}) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const NewUserSchema = Yup.object().shape({
    comment: Yup.string().nullable().required("Comment is required"),
  });
  const { id } = useParams();
  const defaultValues = {
    items: [],
    discount: 0,
    taxes: 0,
    shortDescription: "",
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
    comment: "",
    status: "",
    ipn: "",
    mpn: "",
    manufacturer: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleReject = () => {
    navigate(PATH_DASHBOARD.purchase.request.root);
  };

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    PurchaseRequest.changeStatus({
      id: data.id,
      status: data.status,
      comment: data.comment,
    })
      .then((res) => {
        reset();
        setLoadingSend(false);
        window.Toast(`PR Request ${data.status}`);
        navigate(PATH_DASHBOARD.purchase.request.root);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (id) {
      reset(defaultValues);

      PurchaseRequest.get(id)
        .then((res) => {
          let fieldsValue = {
            ...defaultValues,
            ...res,
            approverComment: res.prApproveComment ?? "",
            // indentor: res.indentorId,
          };



          
          reset(fieldsValue);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <FormProvider methods={methods}>
      <Card>
        <PurchaseRequestApprovalFormDetails />
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
          Submit
        </LoadingButton>

        <LoadingButton
          color="error"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleReject}
        >
          Cancel
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
