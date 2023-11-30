import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import Quotation from "src/controller/purchase/Quotation.controller";
import QuotationeNewEditDetails from "./QuotationNewEditDetails";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import QuotationViewDetails from "./QuotationViewDetails";
// ----------------------------------------------------------------------

QuotationViewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  id: PropTypes.string,
};

export default function QuotationViewForm({ isEdit, isView, data }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [requestDetails, setRequestDetails] = useState({});

  const { id } = useParams();

  const FormSchema = Yup.object().shape({
    // vendorId: Yup.string().nullable().required("vendor is required"),
    // items: Yup.array().min(1, "Select At least one component"),
  });

  const defaultValues = {
    rfqId: "",
    venderQuotationId: "",
    quotationDate: "",
    quotationValidity: "",
    quotationCurrency: "",
    quotationFiles: [],
    items: [],

    paymentTerm: "fullPayment",
    paymentTermsEvents: [
      {
        event: "",
        amount: "",
      },
    ],

    // temp values
    ipn: "",
    itemType: "original",
    suggestedIpn: "",
    requestedQuantity: "",
    quotedQuantity: "",
    partNo: "",
    minimumQuantity: "",
    quotedLeadTime: "",
    quotedUnitPrice: "",
  };

  const methods = useForm({
    // resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isView) {
      reset(defaultValues);

      Quotation.get(id)
        .then((res) => {
          reset({
            ...defaultValues,
            ...res,
          });
        })
        .catch((err) => console.log(err));
    }
  }, []);

  //  useEffect(() => {
  //   if (isEdit) {
  //     setValue("id", data.id);
  //     setValue("host", data.host);
  //     setValue("port", data.port);
  //     setValue("email", data.email);
  //     setValue("password", data.password);
  //     setValue("default", data.default);
  //   } else {
  //     reset({
  //       id: null,
  //       host: "",
  //       port: "",
  //       email: "",
  //       password: "",
  //       default: "",
  //     });
  //   }
  // }, [data]);

  const handleSaveAsDraft = () => {
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.purchase.quotation.root);
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <QuotationViewDetails data={requestDetails} />
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
          onClick={handleSaveAsDraft}
        >
          Cancel
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
