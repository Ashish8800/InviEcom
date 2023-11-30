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
import Manufacture from "src/controller/inventory/Manufacture.controller";
import Warehouse from "src/controller/inventory/Warehouse.controller";

// ----------------------------------------------------------------------

const MANUFACTURER_NAME = ["amazon", "usha", "i ball"];

const UNIT_OPTIONS = ["cm", "box", "dz", "ft", "g", "in", "kg", "ml"];
const WEIGHT_OPTIONS = ["g", "lb", "kg", "oz"];
const LENGTH_OPTIONS = ["cm", "in"];
const HEIGHT_OPTIONS = ["cm", "in"];
const WIDTH_OPTIONS = ["cm", "in"];

// ----------------------------------------------------------------------
export default function InventryViewItemDetails() {
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
    <Grid container spacing={2} p={3}>
      <Grid item sm={12} md={6} width="100%">
        <Box display="grid" rowGap={2} columnGap={2}>
          <RHFTextField disabled="true" name="name" label=" Name*" />

          <Stack>
            <RHFSelect
              disabled="true"
              true
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
                size="large"
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
                disabled="true"
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
                  size="large"
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
              disabled="true"
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
                size="large"
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
              disabled="true"
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
                  disabled="true"
                  name="length"
                  label="Length"
                ></RHFTextField>
              </Grid>
              <Grid item xs={3}>
                <RHFSelect
                  disabled="true"
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
                <RHFTextField disabled="true" name="height" label="Height" />
              </Grid>
              <Grid item xs={3}>
                <RHFSelect
                  disabled="true"
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
                  disabled="true"
                  name="width"
                  label="Width"
                ></RHFTextField>
              </Grid>
              <Grid item xs={3}>
                <RHFSelect
                  disabled="true"
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
                  disabled="true"
                  name="weight"
                  label="Weight"
                ></RHFTextField>
              </Grid>
              <Grid item xs={3}>
                <RHFSelect
                  disabled="true"
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
        </Box>
      </Grid>
      <Grid item sm={12} md={6}>
        <Box display="grid" rowGap={2} columnGap={2}>
          <Stack spacing={1}>
            <RHFUpload
              disabled="true"
              name="cover"
              maxSize={3145728}
              onDrop={handleDrop}
              onDelete={handleRemoveFile}
            />
          </Stack>
          <RHFTextField
            disabled="true"
            name="sku"
            label="SKU (Stock Keeping Unit)"
          />
          <RHFTextField
            disabled="true"
            name="mpn"
            label="MPN (Manufacturing Part Number)"
          />
          <RHFTextField
            disabled="true"
            name="isbn"
            label="ISBN (International Standard Book Number)"
          />

          <RHFTextField
            disabled="true"
            name="ean"
            label="EAN (International Artical Number)"
          />
          <RHFTextField
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
              <RHFCheckbox disabled="true" name="forSale" label="Sales" />

              <RHFTextField
                disabled="true"
                name="sale_cost"
                label="Selling Price"
                sx={{ marginY: 1 }}
              />
              <RHFTextField
                disabled="true"
                name="sale_description"
                label="Description"
                multiline
                rows={1}
              />
            </Card>
          </Grid>

          <Grid item lg={4} xs={12} md={6}>
            <Card sx={{ backgroundColor: "#fbfbfb", p: 3 }}>
              <RHFCheckbox
                disabled="true"
                name="forInternalPurchase"
                label="Internal Purchase"
              />

              <RHFTextField
                disabled="true"
                name="internal_purchase_cost"
                label="Cost Price"
                sx={{ marginY: 1 }}
              />
              <RHFTextField
                disabled="true"
                name="internal_purchase_description"
                label="Description"
                multiline
                rows={1}
              />
            </Card>
          </Grid>

          <Grid item lg={4} xs={12} md={6}>
            <Card sx={{ backgroundColor: "#fbfbfb", p: 3 }}>
              <RHFCheckbox
                disabled="true"
                name="forExternalPurchase"
                label="External Purchase"
              />

              <RHFTextField
                disabled="true"
                name="external_purchase_cost"
                label="Cost Price"
                sx={{ marginY: 1 }}
              />
              <RHFTextField
                disabled="true"
                name="external_purchase_description"
                label="Description"
                multiline
                rows={1}
              />
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
                <RHFTextField
                  name={`warehouse_${item.id}_name`}
                  label={item.name}
                  value={item.name}
                  sx={{ marginY: 1 }}
                  disabled={true}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <RHFTextField
                  disabled="true"
                  name={`warehouse_${item.id}_currentstock`}
                  label={`Current Stock in [ ${item.name} ]`}
                  sx={{ marginY: 1 }}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <RHFTextField
                  disabled="true"
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
  );
}
