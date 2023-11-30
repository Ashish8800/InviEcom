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
  DialogTitle,
  MenuItem,
  Stack,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useSnackbar } from "src/components/snackbar";
import Client from "src/controller/purchase/Client.controller";
import Project from "src/controller/purchase/Project.controller";
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from "../../../../components/hook-form";

// ----------------------------------------------------------------------
AddProjectDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  client: PropTypes.string,
};

export default function AddProjectDialog({ open, onClose, data, client = "" }) {
  const [clientList, setClientList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required("Project name is required"),
    client: Yup.string().required("Client name is required"),
  });

  const defaultValues = {
    name: "",
    client: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const [requestError, setRequestError] = useState("");

  let isEdit = typeof data == "object" ? true : false;

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // if (open && client == "") {
  //   window.Toast("Select a client first", { variant: "error" });
  //   onClose();
  // }

  const onSubmit = async (data) => {
    console.log(data);
    if (isEdit) {
      Project.update(data.id,data)
        .then((res) => {
          enqueueSnackbar("Project updated successfully");
          reset({ ...defaultValues, ...res });
          onClose();
        })
        .catch((error) => {
          window.ToastError(error.message, { variant: "error" });
        });
    } else {
      Project.create(data)
        .then(() => {
          enqueueSnackbar("Project created successfully");
          console.log("Project created successfully", data);
          reset(defaultValues);
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message, { variant: "error" });
          enqueueSnackbar(error.message, { variant: "error" });
        });
    }
  };
  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("client", data.client);
    } else {
      reset({
        name: "",
        client: "",
      });
    }
  }, [data]);

  useEffect(() => {
    setValue("client", client);
  }, [client]);

  useEffect(() => {
    Client.list("?status=active").then((data) => {
      // console.log(data);
      setClientList(data);
    });
  }, []);
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEdit ? "Edit Project" : "Add Project"}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={1} sx={{ paddingTop: 2 }}>
            <RHFSelect
              disabled={isEdit}
              size="small"
              name="client"
              label="Client Name*"
            >
              {clientList?.map((option, i) => {
                return (
                  <MenuItem key={i} value={option.name}>
                    {option.name}
                  </MenuItem>
                );
              })}
            </RHFSelect>

            <RHFTextField size="small" name="name" label="Project Name*" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
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
