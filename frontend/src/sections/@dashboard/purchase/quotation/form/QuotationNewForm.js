import PropTypes from "prop-types";
import { useState } from "react";
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
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import Quotation from "src/controller/purchase/Quotation.controller";
import QuotationeNewEditDetails from "./QuotationNewEditDetails";
// ----------------------------------------------------------------------

QuotationNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  id: PropTypes.string,
};

export default function QuotationNewForm({ isEdit, data, id }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const [rfqList, setRFQList] = useState([]);
  const [vendorData, setVendorData] = useState({});
  const [rfq, setRFQ] = useState({});
  const [rfqItems, setRFQItems] = useState([]);

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [requestDetails, setRequestDetails] = useState({});

  // const { id } = useParams();

  const FormSchema = Yup.object().shape({
    rfqId: Yup.string().nullable().required("RFQ is required"),
    venderQuotationId: Yup.string()
      .nullable()
      .required("Vender Quotation Number is required"),
    quotationDate: Yup.string()
      .nullable()
      .required("Quotation Date is required"),
    quotationValidity: Yup.string()
      .nullable()
      .required("Quotation Validity is required"),
    quotationCurrency: Yup.string()
      .nullable()
      .required("Quotation Currency is required"),
    items: Yup.array().min(1),
    paymentTermsEvents: Yup.array().when(
      "paymentTerm",
      (paymentTerm, schema) => {
        if (paymentTerm !== "fullPayment")
          return schema
            .of(
              Yup.object().shape({
                event: Yup.string()
                  .nullable()
                  .required(
                    "Payment Event is required. such as 'Order Received', 'Order Dispatched'"
                  ),
                amount: Yup.string()
                  .nullable()
                  .required(
                    "Payment Amount is required. Amount in the percentage"
                  ),
              })
            )
            .min(1);
        return schema;
      }
    ),
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
    requestedQty: "",
    quotedQuantity: "",
    partNo: "",
    minimumQuantity: "",
    quotedLeadTime: "",
    quotedUnitPrice: "",
  };

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleSaveAsDraft = () => {
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.purchase.quotation.root);
  };

  const handleCreateAndSend = (data) => {
    console.log(data, "----------------------");
    setLoadingSend(true);

    delete data.ipn;
    delete data.itemType;
    delete data.suggestedIpn;
    delete data.requestedQty;
    delete data.quotedQuantity;
    delete data.partNo;
    delete data.minimumQuantity;
    delete data.quotedLeadTime;
    delete data.quotedUnitPrice;

    if (isEdit) {
      Quotation.update(data.id,data)
        .then((res) => {
          enqueueSnackbar("Quotation update successfully");
          navigate(PATH_DASHBOARD.purchase.quotation.root);
        })
        .catch((err) => {
          enqueueSnackbar(err.message, { variant: "error" });
        });
    } else {
      Quotation.create(data)
        .then(() => {
          reset();
          setLoadingSend(false);
          window.Toast("Purchase Quotation created successfully");
          navigate(PATH_DASHBOARD.purchase.quotation.root);
        })
        .catch((err) => {
          setLoadingSend(false);
          window.Toast(err.message, { variant: "error" });
        });
    }
  };

  useEffect(() => {
    if (isEdit) {
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

  // useEffect(() => {
  //   if (isEdit)  {
  //     console.log(rfqList)
  //     rfqList?.forEach((item) => {
  //       if (item.id == values.rfqId) {
  //         setRFQ(item ?? {});
  //         setVendorData(item.vendor ?? {});
  //         setRFQItems(item.items);
  //         // resetAddComponentInQuotationForm();
  //       }
  //     });
  //   }
  // }, [values.rfqId]);

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit(handleCreateAndSend)}
    >
      <Card>
        <QuotationeNewEditDetails data={requestDetails} />
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
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {id ? "Update" : " Add "}
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
