import * as Yup from "yup";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

// form
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// mock
import { _purchaseAddressFrom } from "../../../../_mock/arrays";
// components
import FormProvider from "../../../../components/hook-form";
import { useSnackbar } from "../../../../components/snackbar";
//
import VendorNewEditDetails from "./VendorNewEditDetails";
import { useParams } from "react-router";
import Vendor from "src/controller/purchase/Vendor.controller";

// ----------------------------------------------------------------------

VendorViewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPurchase: PropTypes.object,
};

export default function VendorViewForm({ isEdit, currentPurchase }) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();

  const defaultValues = {
    id: null,
    salutation: "Mr",
    firstName: "",
    lastName: "",
    companyName: "",
    vendorDisplayName: "",
    vendorEmail: "",
    taxRate: "",
    currency: "",
    website: "",
    pan: "",
    billing: {
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    shipping: {
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
    contactNumber: "",
    phoneNumber: "",
  };

  const SubCategorySchema = Yup.object().shape({
    companyName: Yup.string().required("Company name is required"),
    vendorDisplayName: Yup.string().required("Vendor display name is required"),
    vendorEmail: Yup.string().required("Vendor email is required"),
  });

  const methods = useForm({
    resolver: yupResolver(SubCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSaveAsDraft = () => {
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.purchase.vendor.root);
  };

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    if (isEdit) {
      Vendor.update(data.id, data)
        .then((res) => {
          enqueueSnackbar("Vendor update successfully");
          navigate(PATH_DASHBOARD.purchase.vendor.root);
        })
        .catch((err) => {
          enqueueSnackbar(err.message, { variant: "error" });
        });
    } else {
      Vendor.create(data)
        .then((res) => {
          enqueueSnackbar("Vendor created successfully");
          navigate(PATH_DASHBOARD.purchase.vendor.root);
        })
        .catch((err) => {
          enqueueSnackbar(err.message, { variant: "error" });
        });
    }
  };

  useEffect(() => {
    if (isEdit) {
      Vendor.get(id)
        .then((res) => {
          reset({
            ...defaultValues,
            ...res,
          });
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <FormProvider methods={methods}>
      <Card>
        <VendorNewEditDetails />
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
          {id ? "Update" : "Add "}
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
