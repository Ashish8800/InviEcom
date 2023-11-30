import PropTypes from "prop-types";
import { useState, useMemo, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// mock
import { _purchaseAddressFrom } from "../../../../_mock/arrays";
// components
import FormProvider from "../../../../components/hook-form";
//
import OrderNewEditDetails from "./OrderNewEditDetails";
import InventryNewEditAddress from "./OrderNewEditAddress";
import InventryNewEditStatusDate from "./OrderNewEditStatusDate";
import { Api } from "src/utils";
import apiUrls from "src/routes/apiUrls";

// ----------------------------------------------------------------------

OrderNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPurchase: PropTypes.object,
};

export default function OrderNewEditForm({ isEdit, currentPurchase }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);
  const [customerOrder, setCustomerOrder] = useState({});

  const NewUserSchema = Yup.object().shape({
    status: Yup.string().nullable().required("Status is required"),
  });

  const defaultValues = {
    status: "",
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
    setLoadingSend(true);
    Api.put(apiUrls.customer.order.update(id), data)
      .then((res) => {
        if (res.result) {
          reset();
          setLoadingSend(false);

          window.Toast(res.message);
          navigate(PATH_DASHBOARD.sales.order);
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    Api.get(apiUrls.customer.order.get(id))
      .then((res) => {
        if (res.result) {
          setCustomerOrder(res.data);
        } else {
          window.history.back();
        }
      })
      .catch((err) => {
        window.history.back();
      });
  }, []);

  return (
    <FormProvider methods={methods}>
      <Card>
        <OrderNewEditDetails data={customerOrder} />
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
          UPDATE
        </LoadingButton>

        <LoadingButton
          color="error"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={() => {
            handleSubmit(handleCreateAndSend);
            navigate(PATH_DASHBOARD.sales.order.root);
          }}
        >
          CANCEL
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
