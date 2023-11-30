import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Card,
  Checkbox,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Scrollbar from "../../../components/scrollbar";
// utils
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// assets
// components
import { MODULE_PERMISSIONS } from "src/config-global";
import Role from "src/controller/userManagement/Role.controller";
import { mergeObjectsRecursive } from "src/utils";
import FormProvider, { RHFTextField } from "../../../components/hook-form";
import { useSnackbar } from "../../../components/snackbar";

// ----------------------------------------------------------------------

RoleNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
};

export default function RoleNewEditForm({ isEdit }) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const { roleId } = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const RoleSchema = Yup.object().shape({
    name: Yup.string().required("Role name is required"),
    description: Yup.string().required("Description is required"),
  });

  const defaultValues = {
    name: "",
    description: "",
    permission: {},
  };

  const methods = useForm({
    resolver: yupResolver(RoleSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit) {
      Role.get(roleId)
        .then((res) => {
          reset({
            ...defaultValues,
            ...res,
          });
          setPrivilegeObj(
            mergeObjectsRecursive(MODULE_PERMISSIONS, res.permission)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isEdit]);

  const onSubmit = async (data) => {
    data.permission = privilegeObj;

    if (isEdit && data.id) {
      Role.update(data.id, data)
        .then((res) => {
          reset();
          setLoadingSave(false);
          enqueueSnackbar("Role updated successfully");
          navigate(PATH_DASHBOARD.userManagement.role.root);
        })
        .catch((err) => {
          setLoadingSave(false);
          enqueueSnackbar(err.message, {
            variant: "error",
          });
        });
    } else {
      Role.create(data)
        .then((res) => {
          reset();
          setLoadingSave(false);
          enqueueSnackbar("Role created successfully");
          navigate(PATH_DASHBOARD.userManagement.role.root);
        })
        .catch((err) => {
          setLoadingSave(false);
          enqueueSnackbar(err.message, {
            variant: "error",
          });
        });
    }
  };

  const handleSaveAsDraft = async (data) => {
    reset();
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.userManagement.role.list);
  };

  const [privilegeObj, setPrivilegeObj] = useState(MODULE_PERMISSIONS);

  const [privilege, setPrivilege] = useState([]);

  useEffect(() => {
    setPrivilege(Object.keys(privilegeObj));
  }, []);

  const handlePermissionCheckboxClick = (group, module, permission, value) => {
    const privilegeObjCopy = privilegeObj;
    if (permission == "all") {
      privilegeObjCopy[group][module]["create"] = value;
      privilegeObjCopy[group][module]["read"] = value;
      privilegeObjCopy[group][module]["update"] = value;
      privilegeObjCopy[group][module]["delete"] = value;
    } else {
      privilegeObjCopy[group][module][permission] = value;
    }
    setPrivilegeObj({
      ...privilegeObj,
      ...privilegeObjCopy,
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Stack spacing={2} sx={{ p: 3, pb: 1 }}>
              <RHFTextField name="name" label="Role Name*" />
              <RHFTextField name="description" label="Description" />
            </Stack>
          </Grid>
        </Grid>

        <Stack spacing={2} sx={{ p: 3 }}>
          {privilege.map((group, index) => {
            let childItem = null;

            try {
              childItem = Object.keys(privilegeObj[group]);
            } catch (error) {}

            if (!childItem || childItem.length == 0) return <></>;

            return (
              <Card key={index}>
                <Stack
                  key={index}
                  spacing={2}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h5">
                    {group.replaceAll("_", " ").toUpperCase()}
                  </Typography>
                  <Scrollbar>
                    <Table size={"medium"} sx={{ minWidth: 800 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell width="140px" align="center">
                            Full Access
                          </TableCell>
                          <TableCell width="140px" align="center">
                            Create
                          </TableCell>
                          <TableCell width="140px" align="center">
                            Edit
                          </TableCell>
                          <TableCell width="140px" align="center">
                            View
                          </TableCell>
                          <TableCell width="140px" align="center">
                            Delete
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {childItem.map((moduleName, index) => {
                          let permissionObj = privilegeObj[group][moduleName];

                          return (
                            <TableRow key={index}>
                              <TableCell align="left">
                                {moduleName.replaceAll("_", " ").toUpperCase()}
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox
                                  onChange={(e, value) => {
                                    handlePermissionCheckboxClick(
                                      group,
                                      moduleName,
                                      "all",
                                      value
                                    );
                                  }}
                                  checked={
                                    permissionObj.create &&
                                    permissionObj.read &&
                                    permissionObj.update &&
                                    permissionObj.delete
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox
                                  onChange={(e, value) => {
                                    handlePermissionCheckboxClick(
                                      group,
                                      moduleName,
                                      "create",
                                      value
                                    );
                                  }}
                                  checked={permissionObj.create}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox
                                  onChange={(e, value) => {
                                    handlePermissionCheckboxClick(
                                      group,
                                      moduleName,
                                      "update",
                                      value
                                    );
                                  }}
                                  checked={permissionObj.update}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox
                                  onChange={(e, value) => {
                                    handlePermissionCheckboxClick(
                                      group,
                                      moduleName,
                                      "read",
                                      value
                                    );
                                  }}
                                  checked={permissionObj.read}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox
                                  onChange={(e, value) => {
                                    handlePermissionCheckboxClick(
                                      group,
                                      moduleName,
                                      "delete",
                                      value
                                    );
                                  }}
                                  checked={permissionObj.delete}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </Stack>
              </Card>
            );
          })}
        </Stack>

        <Stack
          justifyContent="flex-end"
          direction="row"
          spacing={2}
          sx={{ p: 2 }}
        >
          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {isEdit ? "Update " : "Add"}
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
      </Card>
    </FormProvider>
  );
}
