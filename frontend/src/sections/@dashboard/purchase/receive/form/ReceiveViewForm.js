import PropTypes from "prop-types";
import { useState, useMemo, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// mock
import { _purchaseAddressFrom } from "src/_mock/arrays";
// components
import FormProvider from "src/components/hook-form";
//
import ReceiveViewDetails from "./ReceiveViewDetails";
import InventryNewEditAddress from "./ReceiveNewEditAddress";
import InventryNewEditStatusDate from "./ReceiveNewEditStatusDate";
import { useParams } from "react-router";
import PurchaseRequest from "src/controller/purchase/PurchaseRequest.controller";
import { fileToBase64 } from "src/utils";
import PurchaseReceive from "src/controller/purchase/PurchaseReceive.controller";
import { ViewGuard } from "src/auth/MyAuthGuard";

// ----------------------------------------------------------------------

ReceiveViewForm.propTypes = {
  isView: PropTypes.bool,
  isEdit: PropTypes.bool,
  currentPurchase: PropTypes.object,
};

export default function ReceiveViewForm({ isEdit, isView, currentPurchase }) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);
  const [purchaseReceive, setPurchaseReceive] = useState({});
  const NewUserSchema = Yup.object().shape({
    purchaseOrderId: Yup.string()
      .nullable()
      .required("Choose a purchase order"),
    receiveDate: Yup.string().nullable().required("Please enter receive date"),
    paymentDate: Yup.string().nullable().required("Please enter payment date"),
    paidToVendor: Yup.string()
      .nullable()
      .required("Please select a paid value"),
    paymentMode: Yup.string()
      .nullable()
      .required("Please select a payment mode"),
    paidAmount: Yup.string().nullable().required("Please enter paid amount"),
  });

  const defaultValues = {
    purchaseOrderId: "",
    receiveDate: null,
    paymentDate: null,
    paidToVendor: "",
    paymentMode: "",
    paidAmount: "",
    comment: "",
    cover: "",
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

  const handleSaveAsDraft = () => {
    reset();
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.purchase.receive.root);
  };
  const { id } = useParams();

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    if (data.cover != undefined) {
      try {
        data.thumbnail = await fileToBase64(data.cover);
        delete data.cover;
      } catch (error) {
        if (data.cover.preview != "") {
          data.thumbnail = data.cover.preview;
        } else {
          window.Toast("Something went wrong with cover picture");
          return false;
        }
      }
    }

    delete data.cover;

    if (data.id) {
      PurchaseReceive.update(data)
        .then((res) => {
          reset();
          setLoadingSave(false);
          navigate(PATH_DASHBOARD.purchase.receive.root);
          window.Toast("Purchase receive updated");
        })
        .catch((err) => {
          setLoadingSave(false);
          window.ToastError(err.message);
        });
    } else {
      PurchaseReceive.create(data)
        .then((res) => {
          reset();
          setLoadingSave(false);
          navigate(PATH_DASHBOARD.purchase.receive.root);
          window.Toast("Purchase receive created");
        })
        .catch((err) => {
          setLoadingSave(false);
          window.ToastError(err.message);
        });
    }
  };

  useEffect(() => {
    if (id != "")
      PurchaseReceive.get(id).then((res) => {
        setPurchaseReceive(res);
        console.log(res);
      });
  }, [id]);

  const handleEdit = () => {
    console.log("handleEditRow", id);
    navigate(PATH_DASHBOARD.purchase.receive.edit(id));
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <ReceiveViewDetails pr={purchaseReceive} />
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <ViewGuard permission="purchase.purchase_receive.update">
          <LoadingButton
            size="large"
            variant="contained"
            loading={loadingSend && isSubmitting}
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
