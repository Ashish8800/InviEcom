import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
// routes
import { PATH_CUSTOMER } from "../../../../routes/paths";
// mock
// components
import FormProvider from "../../../../components/hook-form";
//
import apiUrls from "src/routes/apiUrls";
import { Api } from "src/utils";
import OrderNewEditDetails from "./OrderNewEditDetails";

// ----------------------------------------------------------------------

OrderNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
};

export default function OrderNewEditForm({ isEdit, data }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [customerOrder, setCustomerOrder] = useState({});

  const defaultValues = {
    comment: "",
    billingAddress: {
      address: "",
      city: "",
      state: "",
      country: "",
    },
    shippingAddress: {
      address: "",
      city: "",
      state: "",
      country: "",
    },
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    Api.put(apiUrls.customer.order.cancel(id), data)
      .then((res) => {
        if (res.result) {
          reset();
          setLoadingSend(false);
          window.Toast(res.message);
          navigate(PATH_CUSTOMER.order.history);
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = () => {
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
  };

  const handleBillingAddress = (data) => {
    Api.put(apiUrls.customer.order.update(id), {
      billingAddress: data.billingAddress,
    })
      .then((res) => {
        if (res.result) {
          reset();
          setLoadingSend(false);
          window.Toast("Billing Address updated successfully");
          fetchCustomerData();
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const handleShippingAddress = (data) => {
    Api.put(apiUrls.customer.order.update(id), {
      shippingAddress: data.shippingAddress,
    })
      .then((res) => {
        if (res.result) {
          reset();
          setLoadingSend(false);
          window.Toast("Shipping Address updated successfully");
          fetchCustomerData();
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <OrderNewEditDetails
          data={customerOrder}
          saveBillingAddress={handleSubmit(handleBillingAddress)}
          saveShippingAddress={handleSubmit(handleShippingAddress)}
        />
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        {customerOrder.status != "canceled" && (
          <LoadingButton
            color="warning"
            size="large"
            variant="contained"
            loading={loadingSend && isSubmitting}
            onClick={handleSubmit(handleCreateAndSend)}
          >
            Cancel Order
          </LoadingButton>
        )}

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={() => {
            navigate(PATH_CUSTOMER.home.root);
          }}
        >
          Continue Shopping
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
