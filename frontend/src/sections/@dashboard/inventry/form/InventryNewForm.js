import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { useParams } from "react-router";

// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Alert, Card, Stack } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// mock
// components
import FormProvider from "../../../../components/hook-form";
//
import InventryNewDetails from "./InventryNewDetails";

import Item from "src/controller/inventory/Item.controller";
import { fileToBase64 } from "src/utils";

// ----------------------------------------------------------------------

InventryNewForm.propTypes = {
  isEdit: PropTypes.bool,
  id: PropTypes.string,
  onClose: PropTypes.func,
};

export default function InventryNewForm({ isEdit, id, onClose }) {

  console.log("InventryNewForm");

  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const [requestError, setRequestError] = useState("");

  const ItemSchema = Yup.object().shape({
    // name: Yup.string().nullable().required("Name is required"),
    ipn: Yup.string().nullable().required("IPN is required"),
    description: Yup.string().nullable().required("Description is required"),
    shortDescription: Yup.string()
      .nullable()
      .required("Description is required"),
    categoryId: Yup.string().nullable().required("Category is required"),
    subcategoryId: Yup.string().nullable().required("SubCategory is required"),
    // subcategory: Yup.string().nullable().required("Sub Category is required"),
    // manufeaturer: Yup.string().nullable().required("Manufeaturer is required"),
    unit: Yup.string().nullable().required("Unit is required"),
    // length: Yup.string().required(),
    // length_unit: Yup.string().required("Length unit is required"),
    // height: Yup.string().required(),
    // height_unit: Yup.string().required("Height unit is required"),
    // width: Yup.string().required(),
    // width_unit: Yup.string().required("Width unit is required"),
    // weight: Yup.string().required(),
    // weight_unit: Yup.string().required("Weight unit is required"),
    // ipn: Yup.string().required(),
    // mpn: Yup.string().required(),
    // ivpn: Yup.string().required(),
    // hsn: Yup.string().required(),
    // qlt: Yup.string().required(),
    // upc: Yup.string().required(),
  });

  const defaultValues = {
    ipn: "",
    shortDescription: "",
    description: "",
    categoryId: "",
    unit: "",
    attribute: [],
    subcategoryId: "",
    thumbnail: "",
    datasheet: "",
    files: [],
    otherAttribute: [],
    manufacturer: [],
    forSale: false,
    status: false,
    forPurchase: false,
  };

  const methods = useForm({
    resolver: yupResolver(ItemSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // useEffect(() => {
  //   if (isEdit) {
  //     Item.get(id)
  //       .then((res) => {
  //         const values = {
  //           category: res?.category[0]?.id ?? "",
  //           subcategory: res?.subcategory[0]?.id ?? "",
  //           sale_cost: res.saleData?.price ?? "",
  //           sale_description: res.saleData?.description ?? "",

  //           internal_purchase_cost: res.internalPurchaseData?.price ?? "",
  //           internal_purchase_description:
  //             res.internalPurchaseData?.description ?? "",

  //           external_purchase_cost: res.externalPurchaseData?.price ?? "",
  //           external_purchase_description:
  //             res.externalPurchaseData?.description ?? "",
  //         };

  //         if (res.thumbnail != "") {
  //           values.cover = {
  //             preview: res.thumbnail,
  //           };
  //         }

  //         let fieldsValue = {
  //           ...defaultValues,
  //           ...res,
  //         };
  //         reset(fieldsValue);
  //         console.log(fieldsValue.files);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, []);

  useEffect(() => {
    if (isEdit) {
      Item.get(id)
        .then((res) => {
          reset({
            ...defaultValues,
            ...res,
          });
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleSaveAsDraft = () => {
    setLoadingSave(true);
    if (onClose) {
      onClose();
    } else {
      navigate(PATH_DASHBOARD.inventory.item.root);
    }
  };

  const handleCreateAndSend = async (form) => {

    let data = {...form};
  
     data.status = data.status ? "active" : "inactive";
    console.log(data)

    setLoadingSend(true);
    console.log(data);
    
    if (data.cover != undefined) {
      try {
        data.thumbnail = await fileToBase64(data.cover);
        delete data.cover;
      } catch (error) {
        if (data.cover.preview != "") {
          data.thumbnail = data.cover.preview;
        } else {
          setRequestError("Something went wrong with Item image");
          setLoadingSend(false);
          return false;
        }
      }
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
    
    if (!data.forSale && !data.forPurchase) {
      setRequestError("Choose at least one option for availability");
      window.Toast("Choose at least one option for availability");
      return false;
    } else {
      setRequestError("");
    }


    setTimeout(() => {
      if (!data.id || data.id == "") {
        Item.create(data)
          .then((result) => {
            reset();
            setLoadingSend(false);
            window.Toast("Item created successfully");
            if (onClose) {
              onClose();
            } else {
              navigate(PATH_DASHBOARD.inventory.root);
            }
          })
          .catch((error) => {
            setLoadingSend(false);

            setRequestError(error.message);
          });
      } else {
        Item.update(data.id,data)
          .then((result) => {
            reset();
            window.Toast("Item updated successfully");
            setLoadingSend(false);
            if (onClose) {
              onClose();
            } else {
              navigate(PATH_DASHBOARD.inventory.root);
            }
          })
          .catch((error) => {
            setLoadingSend(false);
            setRequestError(error.message);
          });
      }
    }, 1500);
  };

  const { inventryItemId } = useParams();

  return (
    <FormProvider methods={methods}>
      <Card>
        {Boolean(requestError) && (
          <Alert severity="error">{requestError}</Alert>
        )}
        <InventryNewDetails />
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
          type="submit"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {inventryItemId ? "Update" : "Add"}
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
