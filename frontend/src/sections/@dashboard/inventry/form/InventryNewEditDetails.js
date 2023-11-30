import { useCallback, useEffect, useState } from "react";
// form
import { useFormContext } from "react-hook-form";

// @mui
import {
  Box,
  Button,
  Card,
  Grid,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";

// components
import {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  RHFUpload,
} from "../../../../components/hook-form";

import CategoryController from "src/controller/inventory/Category.controller";
import SubCategoryController from "src/controller/inventory/SubCategory.controller";
import AddManufacturerForm from "src/pages/dashboard/inventry/AddManufacturerForm";
import AddCategoryForm from "src/pages/dashboard/inventry/category/AddCategoryForm";
import AddSubCategoryForm from "src/pages/dashboard/inventry/category/AddSubCategoryForm";

// Controllers
import Editor from "src/components/editor/Editor";
import { Upload } from "src/components/upload";
import Manufacture from "src/controller/inventory/Manufacture.controller";
import Warehouse from "src/controller/inventory/Warehouse.controller";

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
export default function InventryNewEditDetails() {
  const { control, setValue, watch, resetField } = useFormContext();
  const values = watch();

  // states for
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubCategoryList] = useState([]);
  const [manufatureList, setManufatureList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);

  const [manufacturerOpen, setManufacturerOpen] = useState(false);
  const [files, setFiles] = useState([]);
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

  // useEffect(() => {
  //   if (!open) {
  //     setFiles([]);
  //   }
  // }, [open]);

  const [detail, setDetail] = useState("");

  const handleChangeDetail = (value) => {
    setDetail(value);
  };

  const [fullScreen, setFullScreen] = useState(false);

  return (
    <Grid container spacing={2} p={3}>
      <Grid item sm={12} md={6} width="100%">
        <Box display="grid" rowGap={2} columnGap={2}>
          <RHFTextField
            size="small"
            name="name"
            label=" MPN* (Manufacturer Part Number)"
          />

          <Stack>
            <RHFSelect
              size="small"
              fullWidth
              name="category"
              label="Category*"
              onChange={(e) => {
                setValue("category", e.target.value);
                setSelectedCategory(e.target.value);
              }}
            >
              {categoryList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}

              <Button
                fullWidth
                variant="contained"
                size="small"
                onClick={handleCategoryOpen}
                sx={{ marginTop: 1 }}
              >
                Add Category
              </Button>
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
                name="subcategory"
                label="Sub category"
              >
                {subcategoryList.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  sx={{ marginTop: 1 }}
                  onClick={handleSubCategoryOpen}
                >
                  Add Sub Category
                </Button>
              </RHFSelect>
              <AddSubCategoryForm
                category={selectedCategory}
                open={subCategoryOpen}
                onClose={handleSubCategoryClose}
              />
            </Stack>
          )}

          <Stack>
            <RHFSelect
              size="small"
              fullWidth
              name="manufacturer"
              label="Manufacturer"
              placeholder="manufacturer"
            >
              {manufatureList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
              <Button
                fullWidth
                variant="contained"
                size="small"
                sx={{ marginTop: 1 }}
                onClick={handleManufacturerOpen}
              >
                Add Manufacturer
              </Button>
            </RHFSelect>
            <AddManufacturerForm
              open={manufacturerOpen}
              onClose={handleManufacturerClose}
            />
          </Stack>

          <Stack>
            <RHFSelect
              size="small"
              fullWidth
              name="unit"
              label="Unit*"
              textTransform="lowercase"
            >
              <MenuItem value="" />
              {UNIT_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>

          <Stack>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <RHFTextField
                  size="small"
                  name="length"
                  label="Length"
                ></RHFTextField>
              </Grid>
              <Grid item xs={3}>
                <RHFSelect
                  size="small"
                  small
                  name="length_unit"
                  label="UNIT"
                  // InputLabelProps={{ shrink: true }}
                  textTransform="lowercase"
                >
                  {LENGTH_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
            </Grid>
          </Stack>

          <Stack>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <RHFTextField size="small" name="height" label="Height" />
              </Grid>
              <Grid item xs={3}>
                <RHFSelect
                  size="small"
                  fullWidth
                  name="height_unit"
                  label="UNIT"
                  textTransform="lowercase"
                >
                  {HEIGHT_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
            </Grid>
          </Stack>

          <Stack>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <RHFTextField
                  size="small"
                  name="width"
                  label="Width"
                ></RHFTextField>
              </Grid>
              <Grid item xs={3}>
                <RHFSelect
                  size="small"
                  small
                  name="width_unit"
                  label="UNIT"
                  // InputLabelProps={{ shrink: true }}
                  textTransform="lowercase"
                >
                  {WIDTH_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
            </Grid>
          </Stack>

          <Stack>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <RHFTextField
                  size="small"
                  name="weight"
                  label="Weight"
                ></RHFTextField>
              </Grid>
              <Grid item xs={3}>
                <RHFSelect
                  size="small"
                  small
                  name="weight_unit"
                  label="UNIT"
                  // InputLabelProps={{ shrink: true }}
                  textTransform="lowercase"
                >
                  {WEIGHT_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
            </Grid>
          </Stack>
          <RHFTextField
            size="small"
            name="qlt"
            label="QLT (Quoted Lead Time)"
          />
        </Box>
      </Grid>
      <Grid item sm={12} md={6}>
        <Box display="grid" rowGap={2} columnGap={2}>
          <Stack spacing={1}>
            <RHFUpload
              name="cover"
              maxSize={3145728}
              onDrop={handleDrop}
              onDelete={handleRemoveFile}
            />
          </Stack>
          <RHFTextField
            size="small"
            name="ipn"
            label="IPN (Internal Part Number)"
          />
          <RHFTextField
            size="small"
            name="ivpn"
            label="IVPN (Inevitable Part Number)"
          />
          <RHFTextField
            size="small"
            name="hsn"
            label="HSN (Harmonized System of Nomenclature)"
          />

          <RHFTextField
            size="small"
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
          <Grid item lg={6} xs={12} md={6}>
            <Card sx={{ backgroundColor: "#fbfbfb", p: 3 }}>
              <RHFCheckbox name="forSale" label="Sales" />

              <RHFTextField
                size="small"
                name="sale_cost"
                label="Selling Price"
                sx={{ marginY: 1 }}
              />
              <RHFTextField
                size="small"
                name="sale_description"
                label="Description"
                multiline
                rows={1}
              />
            </Card>
          </Grid>

          <Grid item lg={6} xs={12} md={6}>
            <Card sx={{ backgroundColor: "#fbfbfb", p: 3 }}>
              <RHFCheckbox name="forPurchase" label="Purchase" />

              <RHFTextField
                size="small"
                fullWidth
                name="purchase_cost"
                label="Cost Price"
                sx={{ marginY: 1 }}
              />
              <RHFTextField
                size="small"
                fullWidth
                name="purchase_description"
                label="Description"
                multiline
                rows={1}
              />
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2} rowSpacing={2} sx={{ pt: 2 }}>
          <Grid item lg={7} xs={12} md={8}>
            <Stack borderRadius={1} border={1}>
              <Editor
                name="detail"
                full
                id="compose-mail"
                value={detail}
                onChange={handleChangeDetail}
                placeholder="Item Details....."
                sx={{ flexGrow: 1, borderColor: "transparent" }}
              />
            </Stack>
          </Grid>

          <Grid item lg={5} xs={12} md={4}>
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
    </Grid>
  );
}
