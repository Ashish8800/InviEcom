import PropTypes from "prop-types";
import { useState, useMemo, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router";

// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack, Alert } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// mock
import { _purchaseAddressFrom } from "../../../../_mock/arrays";
// components
import FormProvider from "../../../../components/hook-form";
//
import InventryNewEditDetails from "./InventryNewEditDetails";

import { fileToBase64 } from "src/utils";
import Item from "src/controller/inventory/Item.controller";
import { ExitStatus } from "typescript";

// ----------------------------------------------------------------------

InventryNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  id: PropTypes.string,
};

export default function InventryNewEditForm({ isEdit, id }) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const [requestError, setRequestError] = useState("");

  const ItemSchema = Yup.object().shape({
    name: Yup.string().nullable().required("Name is required"),
    category: Yup.string().nullable().required("Category is required"),
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
    name: "",
    category: "",
    unit: "",
    subcategory: "",
    manufacturer: "",
    unit: "",
    length: "",
    length_unit: "",
    height: "",
    height_unit: "",
    width: "",
    width_unit: "",
    weight: "",
    weight_unit: "",
    mpn: "",
    ipn: "",
    ivpn: "",
    hsn: "",
    qlt: "",
    upc: "",
    thumbnail: "",
    files: [],

    forSale: false,
    sale_cost: "",
    sale_description: "",

    forInternalPurchase: false,
    internal_purchase_cost: "",
    internal_purchase_description: "",

    forExternalPurchase: false,
    external_purchase_cost: "",
    external_purchase_description: "",
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

  useEffect(() => {
    if (isEdit) {
      Item.get(id)
        .then((res) => {
          const values = {
            category: res?.category[0]?.id ?? "",
            subcategory: res?.subcategory[0]?.id ?? "",
            sale_cost: res.saleData?.price ?? "",
            sale_description: res.saleData?.description ?? "",

            internal_purchase_cost: res.internalPurchaseData?.price ?? "",
            internal_purchase_description:
              res.internalPurchaseData?.description ?? "",

            external_purchase_cost: res.externalPurchaseData?.price ?? "",
            external_purchase_description:
              res.externalPurchaseData?.description ?? "",
          };

          if (res.thumbnail != "") {
            values.cover = {
              preview: res.thumbnail,
            };
          }

          res.warehouses.forEach((item) => {
            values[`warehouse_${item.id}_currentstock`] = item.currentStock;
            values[`warehouse_${item.id}_minstock`] = item.minStock;
          });

          let fieldsValue = {
            ...defaultValues,
            ...res,
          };
          reset(fieldsValue);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleSaveAsDraft = () => {
    setLoadingSave(true);

    navigate(PATH_DASHBOARD.inventory.item.root);
  };

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    // create warehouse details
    let totalAvailableStock = 0;
    let data_keys = Object.keys(data);
    let warehouse_data_keys = new Set();
    let warehouse_data = [];
    data_keys.forEach((item) => {
      if (item.indexOf("warehouse_") != -1) {
        warehouse_data_keys.add(item.split("_")[1]);
      }
    });
    warehouse_data_keys.forEach((item) => {
      let tempWarehouseObj = {
        id: item,
        currentStock: data[`warehouse_${item}_currentstock`],
        minStock: data[`warehouse_${item}_minstock`],
      };
      warehouse_data.push(tempWarehouseObj);
      if (parseInt(tempWarehouseObj.currentStock) > 0) {
        totalAvailableStock += parseInt(tempWarehouseObj.currentStock);
      }
    });

    data.warehouses = warehouse_data;
    data.totalAvailableStock = totalAvailableStock;

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

    if (
      !data.forSale &&
      !data.forInternalPurchase &&
      !data.forExternalPurchase
    ) {
      setRequestError("Choose at least one option for availability");
      return false;
    } else {
      setRequestError("");
    }

    if (data.forInternalPurchase && data.forExternalPurchase) {
      setRequestError(
        "Internal Purchase and External Purchase can't be select at once"
      );
      return false;
    } else {
      setRequestError("");
    }

    data.saleData = {
      price: data.sale_cost,
      description: data.sale_description,
    };

    delete data.sale_cost;
    delete data.sale_description;

    data.internalPurchaseData = {
      price: data.internal_purchase_cost,
      description: data.internal_purchase_description,
    };

    delete data.internal_purchase_cost;
    delete data.internal_purchase_description;

    data.externalPurchaseData = {
      price: data.external_purchase_cost,
      description: data.external_purchase_description,
    };

    delete data.external_purchase_cost;
    delete data.external_purchase_description;

    if (!data.id || data.id == "") {
      Item.create(data)
        .then((result) => {
          reset();
          setLoadingSend(false);
          window.Toast("Item created successfully");
          navigate(PATH_DASHBOARD.inventory.root);
        })
        .catch((error) => {
          setLoadingSend(false);

          setRequestError(error.message);
        });
    } else {
      Item.update(data)
        .then((result) => {
          reset();
          window.Toast("Item updated successfully");
          setLoadingSend(false);
          navigate(PATH_DASHBOARD.inventory.root);
        })
        .catch((error) => {
          setLoadingSend(false);
          setRequestError(error.message);
        });
    }
  };

  const { inventryItemId } = useParams();

  return (
    <FormProvider methods={methods}>
      <Card>
        {Boolean(requestError) && (
          <Alert severity="error">{requestError}</Alert>
        )}
        <InventryNewEditDetails />
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
