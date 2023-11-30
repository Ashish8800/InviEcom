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
import VendorViewDetails from "./VendorViewDetails";
import { useParams } from "react-router";
import Vendor from "src/controller/purchase/Vendor.controller";
import { ViewGuard } from "src/auth/MyAuthGuard";

// ----------------------------------------------------------------------

VendorViewForm.propTypes = {
  isView: PropTypes.bool,
  isEdit: PropTypes.bool,
  currentPurchase: PropTypes.object,
};

export default function VendorViewForm({ isEdit, isView, currentPurchase }) {
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
      Vendor.update(data)
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
    if (isView) {
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
  const handleEdit = () => {
    console.log("handleEditRow", id);
    navigate(PATH_DASHBOARD.purchase.vendor.edit(id));
  };

  return (
    <ViewGuard permission="purchase.vendor.read" page={true}>
      <FormProvider methods={methods}>
        <Card>
          <VendorViewDetails />
        </Card>

        <Stack
          justifyContent="flex-end"
          direction="row"
          spacing={2}
          sx={{ mt: 3 }}
        >
          <ViewGuard permission="purchase.vendor.update">
            <LoadingButton
              size="large"
              variant="contained"
              loading={loadingSend && isSubmitting}
              // onClick={handleSubmit(handleCreateAndSend)}
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
    </ViewGuard>
  );
}
