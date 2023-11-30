import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CategoryController from "src/controller/inventory/Category.controller";
import SubCategoryController from "src/controller/inventory/SubCategory.controller";
import * as Yup from "yup";
import FormProvider, {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
} from "../../../../components/hook-form";

// ----------------------------------------------------------------------

AddSubCategoryForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  category: PropTypes.string,
};

export default function AddSubCategoryForm({
  open,
  data,
  onClose,
  category,
  subcategory,
}) {
  const [requestError, setRequestError] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const SubCategorySchema = Yup.object().shape({
    name: Yup.string().required("Sub category name is required"),
  });
  let isEdit = typeof data == "object" ? true : false;

  const defaultValues = {
    name: "",
    category: "",
    categoryId: "",
    isDefault: false,
  };

  const methods = useForm({
    resolver: yupResolver(SubCategorySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    data.status = data.isDefault ? "active" : "inactive";

    if (!data.categoryId) {
      setRequestError("Something went wrong, Please refresh the page.");
      return false;
    }

    SubCategoryController.create(data)
      .then((result) => {
        reset(defaultValues);
        onClose();
      })
      .catch((error) => {
        if (error.message == "Category Id is required")
          setRequestError(error.message);
      });
  };
  useEffect(() => {
    if (values.categoryId) {
      // setValue("categoryId", "")
    }
  }, [values.categoryId]);

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("categoryId", data.categoryId);

      setValue("isDefault", data.status == "active" ? true : false);
    } else {
      reset({
        id: null,
        name: "",
        categoryId: "",

        isDefault: false,
      });
    }
  }, [data]);
  useEffect(() => {
    CategoryController.list()
      .then((res) => setCategoryList(res))

      .catch((err) => console.log(err));
  }, []);
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEdit ? "Edit Sub Category" : "Add Sub Category"}
        </DialogTitle>

        <DialogContent dividers>
          {Boolean(requestError) && (
            <Alert severity="error">{requestError}</Alert>
          )}

          <Stack spacing={1} sx={{ pt: 1 }}>
            <RHFSelect
              // disabled="isEdit"
              size="small"
              fullWidth
              name="categoryId"
              label="Category Name*"
            >
              {categoryList.map((option, i) => (
                <MenuItem key={i} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField size="small" name="name" label="Sub Category Name" />
            <RHFCheckbox name="isDefault" label="Active" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Add
          </LoadingButton>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              reset(defaultValues);
              onClose();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
