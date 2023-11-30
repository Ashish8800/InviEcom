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
import { PATH_DASHBOARD } from "../../../../../routes/paths";
// mock
// components
import FormProvider from "../../../../../components/hook-form";
//
import { yupResolver } from "@hookform/resolvers/yup";
import PurchaseRequest from "src/controller/purchase/PurchaseRequest.controller";
import RFQ from "src/controller/purchase/RFQ.controller";
import RFQMailDialog from "src/pages/dashboard/purchase/rfq/dialog/RFQMailDialog";
import RFQFormDetails from "./RFQFormDetails";
import TermsAndConditionController from "src/controller/settings/TermsAndCondition.controller";
import { convertHtmlToText } from "src/utils";

// ----------------------------------------------------------------------

RFQForm.propTypes = {
  isEdit: PropTypes.bool,
  id: PropTypes.string,
  rfqId: PropTypes.string,
};

export default function RFQForm({ isEdit, id, rfqId }) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const [rfqMailDialogState, setRFQMailDialogState] = useState(false);
  const [rfqMailDialogPayload, setRFQMailDialogPayload] = useState({});
  const [requestDetails, setRequestDetails] = useState({});
  const [termsAndCondition, setTermsAndCondition] = useState([]);

  const PurchaseRequestSchema = Yup.object().shape({
    vendorId: Yup.string().nullable().required("vendor is required"),
    items: Yup.array().min(1, "Select At least one component"),
  });

  const defaultValues = {
    items: [],
    vendorId: "",
    prRequestId: "",
    termsAndCondition: "",
    predefinedTermsAndCondition: [],
    additionalTermAndCondition: "",
  };

  const methods = useForm({
    resolver: yupResolver(PurchaseRequestSchema),
    defaultValues,
  });

  const { reset, setValue, handleSubmit, watch } = methods;
  const values = watch();

  const handleSaveAsDraft = () => {
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.purchase.rfq.root);
  };

  const handleRFQMailDialogOpen = (data) => {
    setRFQMailDialogState(true);
    setRFQMailDialogPayload(data);
  };

  const handleRFQMailDialogClose = () => {
    setRFQMailDialogState(true);
    setRFQMailDialogPayload({});
    navigate(PATH_DASHBOARD.purchase.rfq.root);
  };

  const handleCreateAndSend = (data) => {
    setLoadingSend(true);

    data.termAndCondition = "";
    if (data?.predefinedTermsAndCondition?.length > 0) {
      termsAndCondition.forEach((item) => {
        if (data.predefinedTermsAndCondition.includes(item.id)) {
          console.log(item, data.predefinedTermsAndCondition.includes(item.id));
          data.termAndCondition += `${convertHtmlToText(item.description)}\r\n`;
        }
      });
    }

    if (
      data?.termsAndCondition?.indexOf(data.additionalTermAndCondition) === -1
    ) {
      data.termAndCondition += `${data.additionalTermAndCondition}`;
    }

    if (isEdit) {
      RFQ.update(data.id, data)
        .then((res) => {
          window.Toast("RFQ Update successfully");
          navigate(PATH_DASHBOARD.purchase.rfq.root);
        })
        .catch((err) => {
          window.ToastError(err.message);
        });
    } else {
      RFQ.create(data)
        .then((res) => {
          reset();
          setLoadingSend(false);
          window.Toast("RFQ created successfully");
          navigate(PATH_DASHBOARD.purchase.rfq.root);
        })
        .catch((err) => {
          setLoadingSend(false);
          window.ToastError(err.message);
        });
    }
  };

  const fetchPurchaseRequest = (id) => {
    PurchaseRequest.get(id)
      .then((res) => {
        setRequestDetails(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (isEdit) {
      RFQ.get(rfqId)
        .then((res) => {
          fetchPurchaseRequest(res.prRequestId);
          setValue("id", res.id);
          setValue("items", res.items);
          setValue("vendorId", res.vendorId);
          setValue("prRequestId", res.prRequestId);
          setValue("termAndCondition", res.termAndCondition);
        })
        .catch((err) => console.log(err));
    } else {
      fetchPurchaseRequest(id);
    }

    TermsAndConditionController.list().then((res) => {
      let newPreTnc = [];
      res = res.map((data) => {
        const preTnC = values.predefinedTermsAndCondition;
        if (data?.scope?.indexOf("rfq") !== -1 && !preTnC.includes(data.id)) {
          newPreTnc.push(data.id);
        }
        return { label: data.name, value: data.id, ...data };
      });

      setValue("predefinedTermsAndCondition", newPreTnc);

      setTermsAndCondition(res);
    });
  }, []);

  return (
    <>
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(handleCreateAndSend)}
      >
        <Card>
          <RFQFormDetails data={requestDetails} tnc={termsAndCondition} />
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
            loading={loadingSend}
            type="submit"
          >
            Generate RFQ
          </LoadingButton>
          <LoadingButton
            color="error"
            size="large"
            variant="contained"
            onClick={handleSaveAsDraft}
          >
            Cancel
          </LoadingButton>
        </Stack>
      </FormProvider>

      <RFQMailDialog
        open={rfqMailDialogState}
        data={rfqMailDialogPayload}
        onClose={handleRFQMailDialogClose}
      />
    </>
  );
}
