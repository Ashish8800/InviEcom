import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
// assets
import { useEffect, useState } from "react";
import FormProvider from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import Policy from "src/controller/settings/Policy.controller";
import { convertHtmlToText, formateDate } from "src/utils";

// ----------------------------------------------------------------------

ViewPolicyDialog.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBilling: PropTypes.func,
  onCloseCompose: PropTypes.func,
  row: PropTypes.object,
};

export default function ViewPolicyDialog({ open, data, onClose }) {
  const NewPolicySchema = Yup.object().shape({
    name: Yup.string().required("Title is required"),
    effectiveDate: Yup.string().required("Effective Date is required"),
  });

  const { enqueueSnackbar } = useSnackbar();

  let isEdit = typeof data == "object" ? true : false;
  let isView = typeof data == "object" ? true : false;

  const [requestError, setRequestError] = useState("");

  const defaultValues = {
    name: "",
    effectiveDate: "",
    description: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewPolicySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    if (description.length <= 0 || description === "") {
      window.Toast("Please write a policy discription", { variant: "error" });
      return false;
    } else {
      data.description = description;
    }

    if (isEdit) {
      Policy.update(data)
        .then((res) => {
          enqueueSnackbar("Policy updated successfully");
          reset({ ...defaultValues, ...res });
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message);
        });
    } else {
      Policy.create(data)
        .then(() => {
          enqueueSnackbar("Policy created successfully");
          reset(defaultValues);
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message);
        });
    }
  };

  const [description, setDescription] = useState("");

  const handleChangeDescription = (value) => {
    setDescription(value);
  };

  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("description", data.description);
      setValue("effectiveDate", data.effectiveDate);
      setDescription(data.description);
    } else {
      setValue("id", "");
      setValue("name", "");
      setValue("description", "");
      setValue("effectiveDate", null);
      setDescription("");
    }
  }, [data]);

  useEffect(() => {
    if (!isEdit) {
      setValue("description", "");
      setDescription("");
    }
  }, []);

  useEffect(() => {
    if (isView) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("description", data.description);
      setValue("effectiveDate", data.effectiveDate);
      setDescription(data.description);
    }
  });

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="md"
      open={open}
      onClose={onClose}
      sx={{ backgroundColor: "white" }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            py: 2,
            pl: 2.5,
            pr: 1,
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {data?.name} ( {formateDate(data?.effectiveDate)} )
          </Typography>

          <IconButton onClick={() => setFullScreen(!fullScreen)}>
            <Iconify
              icon={fullScreen ? "eva:collapse-fill" : "eva:expand-fill"}
            />
          </IconButton>
        </Stack>

        <DialogContent>
          <Divider />
          <Card disabled="true" sx={{ p: 1, mt: 2 }}>
            <Stack>{convertHtmlToText(data?.description)}</Stack>
          </Card>
        </DialogContent>

        <DialogActions>
          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
