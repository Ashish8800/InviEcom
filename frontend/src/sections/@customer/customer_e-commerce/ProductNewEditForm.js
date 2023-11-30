import PropTypes from "prop-types";
import * as Yup from "yup";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Grid,
  Stack,
  MenuItem,
  Typography,
  InputAdornment,
  Divider,
} from "@mui/material";
// routes
import { PATH_CUSTOMER} from "../../../routes/paths";
// components
import { useSnackbar } from "../../../components/snackbar";
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from "../../../components/hook-form";

import { countries } from "../../../assets/data";

// ----------------------------------------------------------------------

const GENDER_OPTION = [
  { label: "Men", value: "Men" },
  { label: "Women", value: "Women" },
  { label: "Kids", value: "Kids" },
];

const CATEGORY_OPTION = [
  { group: "Clothing", classify: ["Shirts", "T-shirts", "Jeans", "Leather"] },
  {
    group: "Tailored",
    classify: ["Suits", "Blazers", "Trousers", "Waistcoats"],
  },
  {
    group: "Accessories",
    classify: ["Shoes", "Backpacks and bags", "Bracelets", "Face masks"],
  },
];

const TAGS_OPTION = [
  "Toy Story 3",
  "Logan",
  "Full Metal Jacket",
  "Dangal",
  "The Sting",
  "2001: A Space Odyssey",
  "Singin' in the Rain",
  "Toy Story",
  "Bicycle Thieves",
  "The Kid",
  "Inglourious Basterds",
  "Snatch",
  "3 Idiots",
];

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    images: Yup.array().min(1, "Images is required"),
    tags: Yup.array().min(2, "Must have at least 2 tags"),
    price: Yup.number().moreThan(0, "Price should not be $0.00"),
    description: Yup.string().required("Description is required"),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || "",
      description: currentProduct?.description || "",
      images: currentProduct?.images || [],
      code: currentProduct?.code || "",
      sku: currentProduct?.sku || "",
      price: currentProduct?.price || 0,
      priceSale: currentProduct?.priceSale || 0,
      tags: currentProduct?.tags || [TAGS_OPTION[0]],
      inStock: true,
      taxes: true,
      gender: currentProduct?.gender || GENDER_OPTION[2].value,
      category: currentProduct?.category || CATEGORY_OPTION[0].classify[1],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? "Create success!" : "Update success!");
      navigate(PATH_CUSTOMER.product.list);
      console.log("DATA", data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue("images", [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered =
      values.images && values.images?.filter((file) => file !== inputFile);
    setValue("images", filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue("images", []);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary" }}
                >
                  Product Type
                </Typography>

                <RHFRadioGroup
                  row
                  spacing={4}
                  name="product type"
                  options={[
                    { label: "Goods", value: "Goods" },
                    { label: "Services", value: "Services" },
                  ]}
                />
              </Stack>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                }}
              >
                <RHFTextField name="name" label="Product Name" />
                <RHFTextField name="sku" label="SKU (Stock Keeping Unit)" />
                <RHFTextField name="saleprice" label="Selling Price" />
                <RHFTextField name="tax" label="Tax" />
                <RHFTextField name="quantity" label="Quantity" />
                <RHFSelect native name="status" label="Stock Status">
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </RHFSelect>
              </Box>
              <Divider />
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                }}
              >
                <RHFSelect native name="dimensions" label="Dimensions">
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="inch">inch</option>
                </RHFSelect>
                <RHFSelect native name="weight" label="Weight">
                  <option value="kg">kg</option>
                  <option value="gram">gram</option>
                </RHFSelect>
                <RHFSelect native name="category" label="Category">
                  <option value="" />
                  {CATEGORY_OPTION.map((category) => (
                    <optgroup key={category.group} label={category.group}>
                      {category.classify.map((classify) => (
                        <option key={classify} value={classify}>
                          {classify}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect>

                <RHFSelect native name="manufacturer" label="Manufacturer">
                  <option value="" />
                  <option value="philips">philips</option>
                  <option value="usha">usha</option>
                </RHFSelect>

                <RHFTextField
                  name="mpn"
                  label="MPN(Manufacturing Part Number)"
                />
                <RHFTextField name="upc" label="UPC(Universal Product Code)" />
                <RHFTextField
                  name="isbn"
                  label="ISBN(International Standard Book Number)"
                />

                <RHFTextField
                  name="ean"
                  label="EAN(International Artical Number)"
                />
                <RHFSelect
                  native
                  name="country"
                  label="Country Of Manufacturer"
                  placeholder="Country"
                >
                  <option value="" />
                  {countries.map((country) => (
                    <option key={country.code} value={country.label}>
                      {country.label}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect native name="status" label="Status">
                  <option value="active">Active</option>
                  <option value="Inactive">Inactive</option>
                </RHFSelect>
              </Box>

              <Stack spacing={1}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary" }}
                >
                  Product Images and Video
                </Typography>

                <RHFUpload
                  multiple
                  thumbnail
                  name="images"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                  onRemoveAll={handleRemoveAllFiles}
                  onUpload={() => console.log("ON UPLOAD")}
                />
              </Stack>
            </Stack>

            <Stack width="200px" marginTop="5px"
            >
              <LoadingButton
                type="submit"
                variant="contained"
                size="medium"
                loading={isSubmitting}
                width="100px"
              >
                {!isEdit ? "Create Product" : "Save Changes"}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
