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
import { fileToBase64 } from "src/utils";
import PurchaseRequestCorrectionFormDetails from "./PurchaseRequestCorrectionFormDetails";
// ----------------------------------------------------------------------

PurchaseRequestCorrectionForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPurchase: PropTypes.object,
};

export default function PurchaseRequestCorrectionForm({
  isEdit,
  currentPurchase,
}) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const NewUserSchema = Yup.object().shape({
    correctionComment: Yup.string().nullable().required("Comment is required"),
  });
  const { id } = useParams();
  const defaultValues = {
    items: [],
    discount: 0,
    shortDescription: "",
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
    correctionComment: "",
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

  const handleCreateAndSend = async (data) => {
    console.log(
      data,
      "------------------------------------------------------80"
    );
    setLoadingSend(true);

    if (data.files.length > 0) {
      let tempFiles = data.files;
      data.files = [];
      tempFiles.forEach(async (file) => {
        let isBase64 = file?.preview?.indexOf("base64") == -1;
        if (isBase64) {
          let tempFile = await fileToBase64(file);
          if (tempFile)
            data.files.push({
              preview: tempFile,
              name: file.name,
              type: file.type,
            });
        } else {
          data.files.push({
            preview: file.preview,
            name: file.name,
            type: file.type,
          });
        }
      });
    }

    setTimeout(() => {
      PurchaseRequest.update(data.id, data)
        .then((res) => {

          console.log(data,"-----------------------------------------------------111");

          reset();
          setLoadingSend(false);
          window.Toast("Purchase request approved successfully");
          navigate(PATH_DASHBOARD.purchase.request.root);
        })
        .catch((err) => console.log(err));
    }, 1000);
  };

  useEffect(() => {
    if (id) {
      reset(defaultValues);

      PurchaseRequest.get(id)
        .then((res) => {
          let fieldsValue = {
            ...defaultValues,
            ...res,
            indentor: res.indentorId,
            approverComment: res.prApproveComment ?? "",
          };
          reset(fieldsValue);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <FormProvider methods={methods}>
      <Card>
        <PurchaseRequestCorrectionFormDetails />
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
          onClick={() => {
            navigate(PATH_DASHBOARD.purchase.request.root);
          }}
        >
          Cancel
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
