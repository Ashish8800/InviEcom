import { useCallback, useEffect, useState } from "react";
// form
import { useFieldArray, useFormContext } from "react-hook-form";

// @mui
import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
// components
import {
  RHFAutocomplete,
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
} from "../../../../components/hook-form";

import CategoryController from "src/controller/inventory/Category.controller";
import SubCategoryController from "src/controller/inventory/SubCategory.controller";
import AddManufacturerForm from "src/pages/dashboard/inventry/AddManufacturerForm";
import AddCategoryForm from "src/pages/dashboard/inventry/category/AddCategoryForm";
import AddSubCategoryForm from "src/pages/dashboard/inventry/category/AddSubCategoryForm";

// Controllers
import Iconify from "src/components/iconify/Iconify";
import { Upload } from "src/components/upload";
import Manufacture from "src/controller/inventory/Manufacture.controller";
import Warehouse from "src/controller/inventory/Warehouse.controller";
import Searchbar from "src/layouts/dashboard/header/Searchbar";
import { fileToBase64 } from "src/utils";

// ----------------------------------------------------------------------

const UNIT_OPTIONS = [
  "cm",
  "cm²",
  " cm³ ",
  "mm",
  "mm²",
  " mm³ ",
  "inch",
  "inch²",
  "gm",
  "kg",
  " number ",
  "ml",
  "lit",
];
const WEIGHT_OPTIONS = ["g", "lb", "kg", "oz"];
const LENGTH_OPTIONS = ["cm", "in"];
const HEIGHT_OPTIONS = ["cm", "in"];
const WIDTH_OPTIONS = ["cm", "in"];

// ----------------------------------------------------------------------
export default function InventryNewDetails() {
  const { control, setValue, watch, resetField } = useFormContext();
  const values = watch();

  const {
    fields: manufacturerFields,
    append: manufacturerAppend,
    remove: manufacturerRemove,
  } = useFieldArray({
    control,
    name: "manufacturer",
  });

  const {
    fields: productFields,
    append: productAppend,
    remove: productRemove,
  } = useFieldArray({ control, name: "otherAttribute" });

  const {
    fields: attributeFields,
    append: attributeAppend,
    remove: attributeRemove,
  } = useFieldArray({
    control,
    name: "attribute",
  });
  // states for
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubCategoryList] = useState([]);
  const [manufatureList, setManufatureList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [inventryItemList, setInventryItemList] = useState([]);
  const [manufacturerOpen, setManufacturerOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryAttributes, setCategoryAttributes] = useState([]);

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

  const handleAddProduct = () => {
    productAppend({
      type: "",
      description: "",
    });
  };
  const handleAddManufacturer = () => {
    manufacturerAppend({
      id: null,

      mpn: "",
      datasheet: "",
    });
  };

  const handleRemoveProduct = (index) => {
    productRemove(index);
  };
  const handleRemoveManufacturer = (index) => {
    manufacturerRemove(index);
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

  const handleDropFile = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setPreview(true);
      setFiles([...files, ...newFiles]);
      setValue("files", [...files, ...newFiles]);
    },
    [files]
  );

  const handleDropThumnails = useCallback(
    (acceptedFiles) => {
      const newThumbnails = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setPreview(true);
      setThumbnails([...thumbnails, ...newThumbnails]);
      setValue("thumbnails", [...thumbnails, ...newThumbnails]);
    },
    [thumbnails]
  );

  const handleRemoveThumbnails = (inputFile) => {
    const filtered = thumbnails.filter((file) => file !== inputFile);
    setThumbnails(filtered);
    setValue("thumbnails", filtered);
  };

  const handleRemoveFiles = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
    setValue("files", filtered);
  };

  useEffect(() => {
    setFiles(values.files);
    setPreview(true);
  }, [values.files]);

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

    if (values.manufacturer?.length == 0) handleAddManufacturer();
    if (values.otherAttribute?.length == 0) handleAddProduct();
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
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    categoryAttributes?.forEach((attribute) =>
      attributeAppend({ key: attribute.name, value: "" })
    );
  }, [categoryAttributes]);

  return (
    <Grid container spacing={2} p={3}>
      <Grid item sm={12} md={6} width="100%">
        <Box display="grid" rowGap={2} columnGap={2}>
          <Stack>
            <RHFSelect
              size="small"
              fullWidth
              name="categoryId"
              label="Category*"
              onChange={(e) => {
                setValue("categoryId", e.target.value);
                setSelectedCategory(e.target.value);
                categoryList.forEach((item) => {
                  if (item.id == e.target.value) {
                    // console.log(item);
                    attributeRemove();
                    setCategoryAttributes(item.attribute);
                  }
                });
              }}
            >
              {categoryList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}

              {/* <Button
                fullWidth
                variant="contained"
                size="small"
                onClick={handleCategoryOpen}
                sx={{ marginTop: 1 }}
              >
                Add Category
              </Button> */}
            </RHFSelect>

            <AddCategoryForm
              open={categoryOpen}
              onClose={handleCategoryClose}
            />
          </Stack>

          {Boolean(selectedCategory) && (
            <Stack>
              <RHFSelect
                size="small"
                fullWidth
                name="subcategoryId"
                label="Sub category"
              >
                {subcategoryList.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
                {/* <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  sx={{ marginTop: 1 }}
                  onClick={handleSubCategoryOpen}
                >
                  Add Sub Category
                </Button> */}
              </RHFSelect>
              <AddSubCategoryForm
                category={selectedCategory}
                open={subCategoryOpen}
                onClose={handleSubCategoryClose}
              />
            </Stack>
          )}
          <RHFTextField
            size="small"
            name="ipn"
            label=" IPN* (Inevitable Part Number)"
          />
          <RHFTextField
            size="small"
            name="shortDescription"
            label="Description*"
            multiline
            rows={1}
          />

          <RHFSelect
            size="small"
            fullWidth
            name="unit"
            label="UOM* (Unit of Measure)"
            textTransform="lowercase"
          >
            <MenuItem value="" />
            {UNIT_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </RHFSelect>
        </Box>
      </Grid>

      <Grid item sm={12} md={6}>
        <Box display="grid" rowGap={2} columnGap={2}>
          <Stack>
            <Upload
              multiple
              accept={{
                "image/*": [],
              }}
              files={thumbnails}
              thumbnail={preview}
              onDrop={handleDropThumnails}
              onRemove={handleRemoveThumbnails}
            />
          </Stack>
        </Box>
      </Grid>

      <Grid item sm={12} md={12}>
        <RHFTextField
          size="small"
          name="description"
          label=" Detailed Description*"
          multiline
          rows={3}
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <Typography variant="h6" sx={{ mb: 3, pt: 2 }}>
          Product Attributes
        </Typography>

        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
        >
          {/* {JSON.stringify(categoryAttributes)} */}
          {attributeFields?.map((item, i) => {
            // console.log(`attribute.${i}.value`);
            // setValue(`attribute[${i}].value`, "item.name");
            return (
              <RHFTextField
                size="small"
                name={`attribute.${i}.value`}
                label={item.key}
                key={item.key}

                // onChange={(e)=>{console.log(e.target.value);}}
              />
            );
          })}
        </Box>
      </Grid>
      <Grid item xs={12} md={12}>
        <Divider flexItem sx={{ borderStyle: "dashed" }} />
        <Typography variant="h6" sx={{ mb: 3, pt: 2 }}>
          Other Attributes
        </Typography>

        <Stack spacing={1}>
          {productFields.map((item, index) => {
            return (
              <Stack
                key={`${item.id}_${index}`}
                alignItems="flex-end"
                spacing={1}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  alignItems="center"
                  spacing={1}
                  sx={{ width: 1 }}
                >
                  <RHFTextField
                    size="small"
                    name={`otherAttribute[${index}].type`}
                    label="Attribute Type"
                  >
                    <Searchbar />
                  </RHFTextField>

                  <RHFTextField
                    size="small"
                    name={`otherAttribute[${index}].description`}
                    label="Attribute Description"
                  />

                  <Button
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                    onClick={() => handleRemoveProduct(index)}
                  ></Button>
                </Stack>
              </Stack>
            );
          })}
        </Stack>

        {/* <Divider sx={{ my: 1, borderStyle: "dashed" }} /> */}

        <Stack
          sx={{ mt: 2 }}
          spacing={1}
          direction={{ xs: "column-reverse", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Button
            size="small"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAddProduct}
            sx={{ flexShrink: 0 }}
          >
            Add Another Attribute
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={12} md={12}>
        <Divider flexItem sx={{ borderStyle: "dashed" }} />
        <Typography variant="h6" sx={{ mb: 3, pt: 2 }}>
          Manufacturer Reference
        </Typography>

        <Stack spacing={1}>
          {manufacturerFields.map((item, index) => {
            return (
              <Stack
                key={`${item.id}_${index}`}
                alignItems="flex-end"
                spacing={1}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  alignItems="center"
                  spacing={1}
                  sx={{ width: 1 }}
                >
                  <RHFAutocomplete
                    fullWidth
                    size="small"
                    name={`manufacturer[${index}].name`}
                    label="Manufacturer"
                    placeholder="manufacturer"
                    ChipProps={{ size: "small" }}
                    options={manufatureList}
                    getOptionLabel={(option) =>
                      typeof option == "object" ? option.name : option
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.name === value
                    }
                    onChange={(e, value) => {
                      setValue(`manufacturer[${index}].id`, value.id);
                      setValue(`manufacturer[${index}].name`, value.name);
                      setValue(`manufacturer[${index}].mpn`, value.mpn);
                    }}
                    noOptionsText={
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        sx={{ marginTop: 1 }}
                        onClick={handleManufacturerOpen}
                      >
                        Add Manufacturer
                      </Button>
                    }
                  />

                  <AddManufacturerForm
                    open={manufacturerOpen}
                    onClose={handleManufacturerClose}
                  />

                  <RHFTextField
                    size="small"
                    name={`manufacturer[${index}].mpn`}
                    label="MPN (Manufacturer Part Number)"
                  />

                  <TextField
                    type="file"
                    size="small"
                    onChange={async (e, value) => {
                      if (e.target.files.length > 0) {
                        let fileString = await fileToBase64(e.target.files[0]);
                        setValue(
                          `manufacturer[${index}].datasheet`,
                          fileString
                        );
                      }
                    }}
                    label="Mfg Datasheet"
                    InputLabelProps={{ shrink: true }}
                  />

                  <Button
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                    onClick={() => handleRemoveManufacturer(index)}
                  ></Button>
                </Stack>
              </Stack>
            );
          })}
        </Stack>

        <Stack
          sx={{ mt: 2 }}
          spacing={1}
          direction={{ xs: "column-reverse", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Button
            size="small"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAddManufacturer}
            sx={{ flexShrink: 0 }}
          >
            Add Manufacturer Reference
          </Button>

          {/* <Stack
            spacing={2}
            justifyContent="flex-end"
            direction={{ xs: "column", md: "row" }}
            sx={{ width: 1 }}
          >
            <Typography variant="h6">Total Price :</Typography>
            <Typography variant="h6" sx={{ textAlign: "right", width: 120 }}>
              {fCurrency(totalPrice).replace("$", "₹") || ""}
            </Typography>
          </Stack> */}
        </Stack>
      </Grid>

      <Grid container spacing={2} rowSpacing={2}>
        <Grid item lg={6} xs={12} md={6} sx={{ pr: 2 }}>
          <Stack direction="row" display="flex">
            <Typography variant="subtitle1" sx={{ pl: 2, pr: 2, pt: 1 }}>
              Available For :
            </Typography>
            <RHFCheckbox name="forSale" label="Sales" />
            <RHFCheckbox name="forPurchase" label="Purchase" />
          </Stack>

          <Stack direction="row">
            <Typography
              sx={{ pl: 2, pr: 2, pt: 1 }}
              color="inherit"
              variant="subtitle1"
            >
              Status :
            </Typography>
            <RHFCheckbox name="status" label="Active" />
          </Stack>
        </Grid>

        <Grid item lg={6} xs={12} md={6}>
          <Stack>
            <Upload
              multiple
              files={files}
              thumbnail={preview}
              onDrop={handleDropFile}
              onRemove={handleRemoveFiles}
            />
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}
