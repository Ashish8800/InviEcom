import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// components
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { useSettingsContext } from "src/components/settings";
// sections
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
  Box,
  Card,
  Checkbox,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router";

import CategoryController from "src/controller/inventory/Category.controller";
import SubCategoryController from "src/controller/inventory/SubCategory.controller";

import Manufacture from "src/controller/inventory/Manufacture.controller";
import Warehouse from "src/controller/inventory/Warehouse.controller";

// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
// routes
// mock
// components
import FormControlLabel from "@mui/material/FormControlLabel";
import Image from "src/components/image/Image";
import Item from "src/controller/inventory/Item.controller";
import { fileToBase64 } from "src/utils";
// ----------------------------------------------------------------------

const UNIT_OPTIONS = ["cm", "box", "dz", "ft", "g", "in", "kg", "ml"];
const WEIGHT_OPTIONS = ["g", "lb", "kg", "oz"];
const LENGTH_OPTIONS = ["cm", "in"];
const HEIGHT_OPTIONS = ["cm", "in"];
const WIDTH_OPTIONS = ["cm", "in"];

InventryItemViewPage.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,

  id: PropTypes.string,
};
export default function InventryItemViewPage({ isEdit, id, isView }) {
  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const [requestError, setRequestError] = useState("");

  const ItemSchema = Yup.object().shape({
    name: Yup.string().nullable().required("Name is required"),
    category: Yup.string().nullable().required("Category is required"),
    unit: Yup.string().nullable().required("Unit is required"),
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
    sku: "",
    isbn: "",
    ean: "",
    upc: "",
    thumbnail: "",

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
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

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

          reset({
            ...defaultValues,
            ...res,
            ...values,
          });
        })
        .catch((err) => console.log(err));
    }
  }, []);
  useEffect(() => {
    if (isView) {
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

          reset({
            ...defaultValues,
            ...res,
            ...values,
          });
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
      Item.create(data);
      // .then((result) => {
      //   reset();
      //   setLoadingSend(false);
      //   navigate(PATH_DASHBOARD.inventory.root);
      // })
      // .catch((error) => {
      //   setLoadingSend(false);

      //   setRequestError(error.message);
      // });
    } else {
      Item.update(data)
        .then((result) => {
          reset();
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

  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubCategoryList] = useState([]);
  const [manufatureList, setManufatureList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);

  const [manufacturerOpen, setManufacturerOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryOpen = () => {
    setCategoryOpen(true);
  };

  const handleCategoryClose = () => {
    setCategoryOpen(false);
    CategoryController.list()
      .then((res) => setCategoryList(res))
      .catch((err) => console.log(err));
  };

  const handleSubCategoryOpen = () => {
    setSubCategoryOpen(true);
  };

  const handleSubCategoryClose = () => {
    if (selectedCategory != "") {
      SubCategoryController.list(`?categoryId=${selectedCategory}`)
        .then((res) => setSubCategoryList(res))
        .catch((err) => console.log(err));
    }
    setSubCategoryOpen(false);
  };

  const handleManufacturerOpen = () => {
    setManufacturerOpen(true);
  };

  const handleManufacturerClose = () => {
    Manufacture.list()
      .then((result) => setManufatureList(result))
      .catch((error) => console.log(error));
    setManufacturerOpen(false);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("cover", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = () => {
    setValue("cover", null);
  };

  useEffect(() => {
    CategoryController.list()
      .then((res) => setCategoryList(res))
      .catch((err) => console.log(err));
    Warehouse.list()
      .then((result) => setWarehouseList(result))
      .catch((error) => console.log(error));

    Manufacture.list()
      .then((result) => setManufatureList(result))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedCategory != "") {
      SubCategoryController.list(`?categoryId=${selectedCategory}`)
        .then((res) => setSubCategoryList(res))
        .catch((err) => console.log(err));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (values.category != "") setSelectedCategory(values.category);
    console.log(values.category);
  }, [values.category]);

  return (
    <>
      <Helmet>
        <title> Inventry: Create a new Item </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="View Item"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Items",
              href: PATH_DASHBOARD.inventory.item.root,
            },
            {
              name: "View Item",
            },
          ]}
        />

        <Card>
          <Grid container spacing={2} p={3}>
            <Grid item sm={12} md={6} width="100%">
              <Box display="grid" rowGap={2} columnGap={2}>
                <TextField disabled="true" name="name" label="Name*" />
                <TextField disabled="true" name="category" label="Category" />
                <TextField
                  disabled="true"
                  name="subcategory"
                  label="Sub category"
                />
                <TextField
                  disabled="true"
                  name="manufacturer"
                  label="Manufacturer"
                />

                <TextField disabled="true" name="unit" label="Unit*" />
                <TextField disabled="true" name="length" label="Length" />

                <TextField disabled="true" name="height" label="Height" />
                <TextField disabled="true" name="width" label="Width" />
                <TextField disabled="true" name="weight" label="Weight" />
              </Box>
            </Grid>
            <Grid item sm={12} md={6}>
              <Box display="grid" rowGap={2} columnGap={2}>
                <Stack spacing={1}>
                  <Image
                    disabled="true"
                    src="https://images.panda.org/assets/images/pages/welcome/orangutan_1600x1000_279157.jpg"
                    name="cover"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onDelete={handleRemoveFile}
                  />
                </Stack>
                <TextField
                  disabled="true"
                  name="sku"
                  label="SKU (Stock Keeping Unit)"
                />
                <TextField
                  disabled="true"
                  name="mpn"
                  label="MPN (Manufacturing Part Number)"
                />
                <TextField
                  disabled="true"
                  name="isbn"
                  label="ISBN (International Standard Book Number)"
                />

                <TextField
                  disabled="true"
                  name="ean"
                  label="EAN (International Artical Number)"
                />
                <TextField
                  disabled="true"
                  name="upc"
                  label="UPC (Universal Product Code)"
                />
              </Box>
            </Grid>
            <Grid item lg={12}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Available For
              </Typography>

              <Grid container spacing={2} rowSpacing={2}>
                <Grid item lg={4} xs={12} md={6}>
                  <Card sx={{ backgroundColor: "#fbfbfb", p: 3 }}>
                    <FormControlLabel
                      required
                      control={<Checkbox />}
                      label="Sales"
                      name="forSale"
                    />

                    <Stack>
                      <TextField
                        disabled="true"
                        name="sale_cost"
                        label="Selling Price"
                        sx={{ marginY: 1 }}
                      />
                      <TextField
                        disabled="true"
                        name="sale_description"
                        label="Description"
                        multiline
                        rows={1}
                      />
                    </Stack>
                  </Card>
                </Grid>

                <Grid item lg={4} xs={12} md={6}>
                  <Card sx={{ backgroundColor: "#fbfbfb", p: 3 }}>
                    <FormControlLabel
                      required
                      control={<Checkbox />}
                      label="Internal Purchase"
                      name="forInternalPurchase"
                    />
                    <Stack>
                      {" "}
                      <TextField
                        disabled="true"
                        name="internal_purchase_cost"
                        label="Cost Price"
                        sx={{ marginY: 1 }}
                      />
                      <TextField
                        disabled="true"
                        name="internal_purchase_description"
                        label="Description"
                        multiline
                        rows={1}
                      />
                    </Stack>
                  </Card>
                </Grid>

                <Grid item lg={4} xs={12} md={6}>
                  <Card sx={{ backgroundColor: "#fbfbfb", p: 3 }}>
                    <FormControlLabel
                      required
                      control={<Checkbox />}
                      label="External Purchase"
                      name="forExternalPurchase"
                    />
                    <Stack>
                      <TextField
                        disabled="true"
                        name="external_purchase_cost"
                        label="Cost Price"
                        sx={{ marginY: 1 }}
                      />
                      <TextField
                        disabled="true"
                        name="external_purchase_description"
                        label="Description"
                        multiline
                        rows={1}
                      />
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <Grid item sm={12} md={12}>
              <Typography variant="h6" sx={{ marginY: 2 }}>
                Warehouse
              </Typography>

              {warehouseList.map((item, index) => {
                return (
                  <Grid container spacing={1} key={`warehouse_index_${index}`}>
                    <Grid item md={4} xs={12}>
                      <TextField
                        fullWidth
                        name={`warehouse_${item.id}_name`}
                        label={item.name}
                        value={item.name}
                        sx={{ marginY: 1 }}
                        disabled={true}
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <TextField
                        disabled="true"
                        fullWidth
                        name={`warehouse_${item.id}_currentstock`}
                        label={`Current Stock in [ ${item.name} ]`}
                        sx={{ marginY: 1 }}
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <TextField
                        disabled="true"
                        fullWidth
                        name={`warehouse_${item.id}_minstock`}
                        label={`Min Stock in [ ${item.name} ]`}
                        sx={{ marginY: 1 }}
                      />
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
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
      </Container>
    </>
  );
}
