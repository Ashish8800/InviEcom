import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
// assets
import { useEffect, useState } from "react";
import Editor from "src/components/editor";
import FormProvider, {
  RHFMultiSelect,
  RHFSwitch,
  RHFTextField,
} from "src/components/hook-form";
import TermsAndConditionController from "src/controller/settings/TermsAndCondition.controller";
// ----------------------------------------------------------------------
const Multiple_Number = ["Purchase Order", "RFQ"];

AddTermsAndConditionsDialog.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBilling: PropTypes.func,
  onCloseCompose: PropTypes.func,
  row: PropTypes.object,
};

const OPTIONS = [
  { value: "po", label: "Purchase Order" },
  { value: "rfq", label: "RFQ" },
];

export default function AddTermsAndConditionsDialog({
  open,
  data,
  onClose,
  isView,
}) {
  const TermsAndConditionSchema = Yup.object().shape({
    name: Yup.string().required("Title is required"),
  });

  let isEdit = typeof data == "object" ? true : false;
  const [personName, setPersonName] = useState([]);

  const [requestError, setRequestError] = useState("");

  const defaultValues = {
    name: "",
    scope: [],
    default: false,
  };

  const methods = useForm({
    resolver: yupResolver(TermsAndConditionSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    console.log(data);
    if (description.length <= 0 || description === "") {
      window.Toast("Please write a term and condition discription", {
        variant: "error",
      });
      return false;
    } else {
      data.description = description;
    }

    TermsAndConditionController.create(data)
      .then(() => {
        window.Toast("Terms And Condition created successfully");
        reset(defaultValues);
        onClose();
      })
      .catch((error) => {
        setRequestError(error.message);
        window.Toast("Duplicate Terms And Condition name", {
          variant: "error",
        });
      });
  };

  const [description, setDescription] = useState("");

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleChangeDescription = (value) => {
    setDescription(value);
  };

  useEffect(() => {
    setValue("id", "");
    setValue("name", "");
    setValue("description", "");
    setDescription("");
  }, [data]);

  useEffect(() => {
    if (!isEdit) {
      setValue("description", "");
      setDescription("");
    }
  }, []);

  return (
    <Dialog maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography variant="h6">Add Terms & Conditions</Typography>
            <RHFTextField name="name" label="Title" size="small" />

            <Editor
              name="description"
              full
              id="compose-mail"
              value={description}
              onChange={handleChangeDescription}
              placeholder="T&C Description....."
              sx={{ flexGrow: 1, borderColor: "transparent" }}
            />
            <Divider />

            <RHFSwitch name="default" labelPlacement="start" label="Default" />

            {values.default && (
              <RHFMultiSelect
                chip
                checkbox
                name="scope"
                label="Scope"
                // size="small"

                options={OPTIONS}
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {isEdit ? "Update" : "Add"}
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
