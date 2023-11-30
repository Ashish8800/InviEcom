import sum from "lodash/sum";
import { useCallback, useEffect, useState } from "react";
// form
import { useFieldArray, useFormContext } from "react-hook-form";
// @mui
import { Box, Button, Grid, MenuItem, Stack } from "@mui/material";
// utils
// components
import {
  RHFSelect,
  RHFTextField,
  RHFUpload,
} from "../../../../components/hook-form";

import AddManufacturerForm from "src/pages/dashboard/inventry/AddManufacturerForm";
import AddCategoryForm from "src/pages/dashboard/inventry/category/AddCategoryForm";
import AddSubCategoryForm from "src/pages/dashboard/inventry/category/AddSubCategoryForm";

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  { id: 1, name: "full stack development", price: 90.99 },
  { id: 2, name: "backend development", price: 80.99 },
  { id: 3, name: "ui design", price: 70.99 },
  { id: 4, name: "ui/ux design", price: 60.99 },
  { id: 5, name: "front end development", price: 40.99 },
];
const SUBCATEGORY_NAME = ["item1", "item2", "item3"];
const CATEGORY_NAME = ["category1", "category2", "category3"];
const MANUFACTURER_NAME = ["amazon", "usha", "i ball"];
const UNIT_OPTIONS = ["cm", "dz", "ft", "g", "in", "kg", "ml"];
const WEIGHT_OPTIONS = ["g", "lb", "kg", "oz"];
const LENGTH_OPTIONS = ["CM", "IN"];
const HEIGHT_OPTIONS = ["CM", "IN"];
const WIDTH_OPTIONS = ["CM", "IN"];

// ----------------------------------------------------------------------

export default function InventryNewEditDetails() {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [categoryOpen, setCategoryOpen] = useState(false);

  const handleCategoryOpen = () => {
    setCategoryOpen(true);
  };

  const handleCategoryClose = () => {
    setCategoryOpen(false);
  };

  const [subCategoryOpen, setSubCategoryOpen] = useState(false);

  const handleSubCategoryOpen = () => {
    setSubCategoryOpen(true);
  };

  const handleSubCategoryClose = () => {
    setSubCategoryOpen(false);
  };
  const [manufacturerOpen, setManufacturerOpen] = useState(false);

  const handleManufacturerOpen = () => {
    setManufacturerOpen(true);
  };

  const handleManufacturerClose = () => {
    setManufacturerOpen(false);
  };

  const values = watch();

  const totalOnRow = values.items.map((item) => item.quantity * item.price);

  const totalPrice = sum(totalOnRow) - values.discount + values.taxes;

  useEffect(() => {
    setValue("totalPrice", totalPrice);
  }, [setValue, totalPrice]);

  const handleAdd = () => {
    append({
      title: "",
      description: "",
      service: "",
      quantity: 1,
      price: 0,
      total: 0,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index) => {
      resetField(`items[${index}].quantity`);
      resetField(`items[${index}].price`);
      resetField(`items[${index}].total`);
    },
    [resetField]
  );

  const handleSelectService = useCallback(
    (index, option) => {
      setValue(
        `items[${index}].price`,
        SERVICE_OPTIONS.find((service) => service.name === option)?.price
      );
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

  const handleChangeQuantity = useCallback(
    (event, index) => {
      setValue(`items[${index}].quantity`, Number(event.target.value));
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

  const handleChangePrice = useCallback(
    (event, index) => {
      setValue(`items[${index}].price`, Number(event.target.value));
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

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

  return (
    <Grid container spacing={2} p={3}>
      <Grid item sm={12} md={6} width="100%">
        <Box display="grid" rowGap={2} columnGap={2}>
          <RHFTextField name="name" label=" Name" />

          <Stack>
            <RHFSelect
              fullWidth
              name="category"
              label="Category"
              InputLabelProps={{ shrink: true }}
            >
              {CATEGORY_NAME.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
              <MenuItem>
                <Button
                  fullWidth
                  color="inherit"
                  variant="outlined"
                  size="large"
                  onClick={handleCategoryOpen}
                >
                  Add Category
                </Button>
              </MenuItem>
            </RHFSelect>
            <AddCategoryForm
              open={categoryOpen}
              onClose={handleCategoryClose}
            />
          </Stack>
          <Stack>
            <RHFSelect
              fullWidth
              name="subcategory"
              label="Sub category"
              InputLabelProps={{ shrink: true }}
            >
              {SUBCATEGORY_NAME.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
              <MenuItem>
                <Button
                  fullWidth
                  color="inherit"
                  variant="outlined"
                  size="large"
                  onClick={handleSubCategoryOpen}
                >
                  Add Sub Category
                </Button>
              </MenuItem>
            </RHFSelect>
            <AddSubCategoryForm
              open={subCategoryOpen}
              onClose={handleSubCategoryClose}
            />
          </Stack>

          <Stack>
            <RHFSelect
              fullWidth
              name="manufacturer"
              label="Manufacturer"
              InputLabelProps={{ shrink: true }}
            >
              {MANUFACTURER_NAME.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
              <MenuItem>
                <Button
                  fullWidth
                  color="inherit"
                  variant="outlined"
                  size="large"
                  onClick={handleManufacturerOpen}
                >
                  Add Manufacturer
                </Button>
              </MenuItem>
            </RHFSelect>
            <AddManufacturerForm
              open={manufacturerOpen}
              onClose={handleManufacturerClose}
            />
          </Stack>

          <Stack>
            <RHFTextField name="length" label="Length">
              <RHFSelect
                small
                name="length"
                label="Length"
                InputLabelProps={{ shrink: true }}
              >
                {LENGTH_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
            </RHFTextField>
          </Stack>
          <Stack>
            <RHFSelect
              fullWidth
              name="height"
              label="Height"
              InputLabelProps={{ shrink: true }}
            >
              {HEIGHT_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
          <Stack>
            <RHFSelect
              fullWidth
              name="width"
              label="Width"
              InputLabelProps={{ shrink: true }}
            >
              {WIDTH_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
          {/* <Stack>
              <RHFSelect
                fullWidth
                name="unit"
                label="Unit"
                InputLabelProps={{ shrink: true }}
              >
                {UNIT_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
            <Stack>
              <RHFSelect
                fullWidth
                name="weight"
                label="Weight"
                InputLabelProps={{ shrink: true }}
              >
                {WEIGHT_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack> */}
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
          <RHFTextField name="sku" label="SKU (Stock Keeping Unit)" />
          <RHFTextField name="mpn" label="MPN(Manufacturing Part Number)" />
          <RHFTextField
            name="isbn"
            label="ISBN(International Standard Book Number)"
          />

          <RHFTextField name="ean" label="EAN(International Artical Number)" />
          <RHFTextField name="upc" label="UPC(Universal Product Code)" />
          <Stack>
            <RHFSelect
              fullWidth
              name="unit"
              label="Unit"
              InputLabelProps={{ shrink: true }}
            >
              {UNIT_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
          <Stack>
            <RHFSelect
              fullWidth
              name="weight"
              label="Weight"
              InputLabelProps={{ shrink: true }}
            >
              {WEIGHT_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </Box>
      </Grid>
    </Grid>

    // <Grid item xs={12} md={12}>
    //   <Card sx={{ p: 3 }}>
    //     <Box
    //       rowGap={3}
    //       columnGap={2}
    //       display="grid"
    //       gridTemplateColumns={{
    //         xs: "repeat(1, 1fr)",
    //         sm: "repeat(2, 1fr)",
    //       }}
    //     >
    //       <RHFTextField name="name" label=" Name" />
    //       {/* <Stack spacing={1}>
    //         <RHFUpload
    //           name="cover"
    //           maxSize={3145728}
    //           onDrop={handleDrop}
    //           onDelete={handleRemoveFile}
    //         />
    //       </Stack> */}
    //       <Stack>
    //         <RHFSelect
    //           fullWidth
    //           name="category"
    //           label="Category"
    //           InputLabelProps={{ shrink: true }}
    //         >
    //           {CATEGORY_NAME.map((option) => (
    //             <MenuItem key={option} value={option}>
    //               {option}
    //             </MenuItem>
    //           ))}
    //           <MenuItem>
    //             <Button
    //               fullWidth
    //               color="inherit"
    //               variant="outlined"
    //               size="large"
    //               onClick={handleCategoryOpen}
    //             >
    //               Add Category
    //             </Button>
    //           </MenuItem>
    //         </RHFSelect>
    //         <AddCategoryForm
    //           open={categoryOpen}
    //           onClose={handleCategoryClose}
    //         />
    //       </Stack>
    //       <Stack>
    //         <RHFSelect
    //           fullWidth
    //           name="subcategory"
    //           label="Sub category"
    //           InputLabelProps={{ shrink: true }}
    //         >
    //           {SUBCATEGORY_NAME.map((option) => (
    //             <MenuItem key={option} value={option}>
    //               {option}
    //             </MenuItem>
    //           ))}
    //           <MenuItem>
    //             <Button
    //               fullWidth
    //               color="inherit"
    //               variant="outlined"
    //               size="large"
    //               onClick={handleSubCategoryOpen}
    //             >
    //               Add Sub Category
    //             </Button>
    //           </MenuItem>
    //         </RHFSelect>
    //         <AddSubCategoryForm
    //           open={subCategoryOpen}
    //           onClose={handleSubCategoryClose}
    //         />
    //       </Stack>

    //       <Stack>
    //         <RHFSelect
    //           fullWidth
    //           name="manufacturer"
    //           label="Manufacturer"
    //           InputLabelProps={{ shrink: true }}
    //         >
    //           {MANUFACTURER_NAME.map((option) => (
    //             <MenuItem key={option} value={option}>
    //               {option}
    //             </MenuItem>
    //           ))}
    //           <MenuItem>
    //             <Button
    //               fullWidth
    //               color="inherit"
    //               variant="outlined"
    //               size="large"
    //               onClick={handleManufacturerOpen}
    //             >
    //               Add Manufacturer
    //             </Button>
    //           </MenuItem>
    //         </RHFSelect>
    //         <AddManufacturerForm
    //           open={manufacturerOpen}
    //           onClose={handleManufacturerClose}
    //         />
    //       </Stack>
    //       <RHFTextField name="sku" label="SKU (Stock Keeping Unit)" />
    //       <RHFTextField name="mpn" label="MPN(Manufacturing Part Number)" />
    //       <RHFTextField name="upc" label="UPC(Universal Product Code)" />
    //       <RHFTextField
    //         name="isbn"
    //         label="ISBN(International Standard Book Number)"
    //       />

    //       <RHFTextField name="ean" label="EAN(International Artical Number)" />
    //       <Stack>
    //         <RHFTextField name="length" label="Length">
    //           <RHFSelect
    //             small
    //             name="length"
    //             label="Length"
    //             InputLabelProps={{ shrink: true }}
    //           >
    //             {LENGTH_OPTIONS.map((option) => (
    //               <MenuItem key={option} value={option}>
    //                 {option}
    //               </MenuItem>
    //             ))}
    //           </RHFSelect>
    //         </RHFTextField>
    //       </Stack>
    //       <Stack>
    //         <RHFSelect
    //           fullWidth
    //           name="height"
    //           label="Height"
    //           InputLabelProps={{ shrink: true }}
    //         >
    //           {HEIGHT_OPTIONS.map((option) => (
    //             <MenuItem key={option} value={option}>
    //               {option}
    //             </MenuItem>
    //           ))}
    //         </RHFSelect>
    //       </Stack>
    //       <Stack>
    //         <RHFSelect
    //           fullWidth
    //           name="width"
    //           label="Width"
    //           InputLabelProps={{ shrink: true }}
    //         >
    //           {WIDTH_OPTIONS.map((option) => (
    //             <MenuItem key={option} value={option}>
    //               {option}
    //             </MenuItem>
    //           ))}
    //         </RHFSelect>
    //       </Stack>
    //       <Stack>
    //         <RHFSelect
    //           fullWidth
    //           name="unit"
    //           label="Unit"
    //           InputLabelProps={{ shrink: true }}
    //         >
    //           {UNIT_OPTIONS.map((option) => (
    //             <MenuItem key={option} value={option}>
    //               {option}
    //             </MenuItem>
    //           ))}
    //         </RHFSelect>
    //       </Stack>
    //       <Stack>
    //         <RHFSelect
    //           fullWidth
    //           name="weight"
    //           label="Weight"
    //           InputLabelProps={{ shrink: true }}
    //         >
    //           {WEIGHT_OPTIONS.map((option) => (
    //             <MenuItem key={option} value={option}>
    //               {option}
    //             </MenuItem>
    //           ))}
    //         </RHFSelect>
    //       </Stack>
    //     </Box>

    //     {/* <Box sx={{ flexGrow: 1 }}>
    //       <Typography variant="h6" sx={{ mb: 3 }}>
    //         Available For
    //       </Typography>
    //       <Grid
    //         container
    //         spacing={{ xs: 2, md: 3 }}
    //         columns={{ xs: 4, sm: 8, md: 12 }}
    //       >
    //         <Grid item xs={2} sm={4} md={4}>
    //           <RHFTextField name="selling" label="Selling Price" />
    //           <RHFTextField
    //             name="description"
    //             label="Description"
    //             multiline
    //             rows={3}
    //           />
    //         </Grid>
    //         <Grid item xs={2} sm={4} md={4}>
    //           <RHFCheckbox>Sales</RHFCheckbox>
    //           <RHFTextField name="cost" label="Cost Price" />
    //           <RHFTextField
    //             name="description"
    //             label="Description"
    //             multiline
    //             rows={3}
    //           />
    //         </Grid>
    //         <Grid item xs={2} sm={4} md={4}>
    //           <RHFTextField name="cost" label="Cost Price" />
    //           <RHFTextField
    //             name="description"
    //             label="Description"
    //             multiline
    //             rows={3}
    //           />
    //         </Grid>
    //       </Grid>
    //     </Box> */}
    //   </Card>
    // </Grid>
  );
}
