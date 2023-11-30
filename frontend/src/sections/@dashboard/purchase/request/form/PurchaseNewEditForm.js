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
import FormProvider from "src/components/hook-form";
//
import { adminId } from "src/auth/utils";
import PurchaseRequest from "src/controller/purchase/PurchaseRequest.controller";
import { fileToBase64 } from "src/utils";
import PurchaseNewEditDetails from "./PurchaseNewEditDetails";
import { yupResolver } from "@hookform/resolvers/yup";
// ----------------------------------------------------------------------

PurchaseNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  id: PropTypes.string,
};

export default function PurchaseNewEditForm({ isEdit, id }) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const PurchaseRequestSchema = Yup.object().shape({
    indentor: Yup.string().nullable().required("Indentor is required"),
    requestSource: Yup.string()
      .nullable()
      .required("Requested Source is required"),
    prApprover: Yup.string().nullable().required("PR Approver is required"),

    deliverTo: Yup.string().nullable().required("Warehouse is required"),
  
    items: Yup.array()
      .of(
        Yup.object().shape({
          ipn: Yup.string().required("IPN is required"),
          manufacturer: Yup.string().required("Manufacturer is required"),
        })
      )
      .min(1, "Minimum one component is required"),
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
    ipn: "",
    mpn: "",
    manufacturer: "",
    description: "",
    deliveryDate: null,
    total: 0,
    prApprover: "",
    files: [],
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

  useEffect(() => {
    if (isEdit) {
      reset(defaultValues);

      PurchaseRequest.get(id)
        .then((res) => {
          let fieldsValue = {
            ...defaultValues,
            ...res,
            indentor: res.indentorId,
          };
          reset(fieldsValue);
          console.log(fieldsValue.files);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleSaveAsDraft = () => {
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.purchase.request.root);
  };

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    if (data.items.length == 0) {
      window.Toast("Add at least one item", { variant: "error" });
      return false;
    }

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
      if (data.id) {
        PurchaseRequest.update(data)
          .then(() => {
            reset();
            setLoadingSend(false);
            navigate(PATH_DASHBOARD.purchase.request.root);
            window.Toast("Purchase request updated successfully");
          })
          .catch((err) => {
            window.Toast(err.message, { variant: "error" });
          });
      } else {
        PurchaseRequest.create(data)
          .then(() => {
            reset();
            setLoadingSend(false);
            navigate(PATH_DASHBOARD.purchase.request.root);
            window.Toast("Purchase request added successfully");
          })
          .catch((err) => {
            window.Toast(err.message, { variant: "error" });
          });
      }
    }, 1000);
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <PurchaseNewEditDetails />
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
          {isEdit ? "Update" : "Add "}
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
