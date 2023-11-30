import PropTypes from "prop-types";
import * as Yup from "yup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  MenuItem,
  Typography,
  FormControlLabel,
} from "@mui/material";
// utils
import { fData } from "../../../utils/formatNumber";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// assets
import { countries } from "../../../assets/data";
// components
import Label from "../../../components/label";
import { useSnackbar } from "../../../components/snackbar";
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField ,
  RHFRadioGroup,
  RHFUploadAvatar,
} from "../../../components/hook-form";
import { MuiTelInput } from "mui-tel-input";
import User from "src/controller/userManagement/User.controller";
import { fileToBase64 } from "src/utils";
import Role from "src/controller/userManagement/Role.controller";
import { ViewGuard } from "src/auth/MyAuthGuard";

// ----------------------------------------------------------------------
const ROLE_OPTIONS = [
  "all",
  "ux designer",
  "full stack designer",
  "backend developer",
  "project manager",
  "leader",
  "ui designer",
  "ui/ux designer",
  "front end developer",
  "full stack developer",
];

UserViewForm.propTypes = {
  isView: PropTypes.bool,
  isEdit: PropTypes.bool,
  userId: PropTypes.string,
};

export default function UserViewForm({ isEdit = false,isView=false, userId }) {
  const navigate = useNavigate();
  const [loadingSave, setLoadingSave] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [rolesList, setRoleList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Your name should be of atleast 3 character")
      .matches(/^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/, "Name should be in a valid format")
      .required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    phoneNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    role: Yup.string().required("Role is required"),
    pincode: Yup.string()
      .matches(
        /^\(?([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{2})$/,
        "Pincode should be a 6 digit number"
      )
      .required("pincode required"),
    avatarUrl: Yup.string().required("Avatar is required").nullable(true),
  });
  const defaultValues = {
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    avatarUrl: null,
    isVerified: true,
    status: "inactive",
    company: "",
    role: "",
    pincode: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const handleSaveAsDraft = async (data) => {
    setLoadingSave(true);
    navigate(PATH_DASHBOARD.userManagement.user.list);
  };

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isView && userId) {
      User.get(userId).then((res) => {
        reset({ ...defaultValues, ...res });
        setPhoneNumber(res.phoneNumber);
      });
    }
  }, []);

  const onSubmit = async (data) => {
    if (isView && data.id) {
      User.update(data)
        .then((res) => {
          enqueueSnackbar("User updated successfully");
          navigate(PATH_DASHBOARD.userManagement.user.list);
        })
        .catch((err) => {
          enqueueSnackbar(err.message, { variant: "error" });
        });
    } else {
      User.create(data)
        .then((res) => {
          enqueueSnackbar("User created successfully");
          navigate(PATH_DASHBOARD.userManagement.user.list);
        })
        .catch((err) => {
          enqueueSnackbar(err.message, { variant: "error" });
        });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        fileToBase64(file).then((res) => {
          setValue("avatarUrl", res);
        });
      }
    },
    [setValue]
  );

  useEffect(() => {
    setPhoneNumberError(formState.errors.phoneNumber?.message ?? "");
  }, [formState.errors]);

  useEffect(() => {
    Role.list().then((res) => setRoleList(res));
  }, []);

  const handleEdit = () => {
    navigate(PATH_DASHBOARD.userManagement.user.edit(userId));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {isView && (
              <Label
              disabled="true"
                color={values.status === "active" ? "success" : "error"}
                sx={{
                  textTransform: "uppercase",
                  position: "absolute",
                  top: 24,
                  right: 24,
                }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                disabled="true"
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack>
              {isEdit && (
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    User ID:
                  </Typography>
                  <Typography>{values.id}</Typography>
                </Stack>
              )}
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
              <RHFTextField   disabled="true"  name="name" label="Name" />
              <RHFTextField   disabled="true"  name="email" label="Email Address" />
              <RHFSelect    disabled="true" fullWidth name="role" label="Role">
                {rolesList.map((option) => (
                  <MenuItem key={option.id} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <MuiTelInput
                disabled="true"
                defaultCountry="IN"
                name="phoneNumber"
                value={phoneNumber}
                label="Contact Number"
                onChange={(value) => {
                  setPhoneNumber(value);
                  setPhoneNumberError("");
                  setValue("phoneNumber", value);
                }}
                error={Boolean(phoneNumberError)}
                helperText={phoneNumberError}
              />
              <RHFTextField   disabled="true"  name="address" label="Address" />
              <RHFTextField   disabled="true"  name="state" label="State/Region" />
              <RHFTextField   disabled="true"  name="city" label="City" />

              <RHFSelect
                native
                name="country"
                label="Country"
                placeholder="Country"
                disabled="true"
              >
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField   disabled="true"   name="pincode" label="PIN Code" />
              <Stack direction="row">
                <Typography paragraph sx={{ pr: 2, pt: 1 }}>
                  Status:
                </Typography>
                <RHFRadioGroup
                  disabled="true"
                  row
                  spacing={2}
                  name="status"
                  options={[
                    { label: "Active", value: "active" ,  disabled:"true"},
                    { label: "Inactive", value: "inactive" ,  disabled:"true"},
                  ]}
                />
              </Stack>
            </Box>

            <Stack
              justifyContent="flex-end"
              direction="row"
              spacing={2}
              sx={{ mt: 3 }}
            >
              <ViewGuard permission="users_and_roles.users.update">
              <LoadingButton
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                onClick={handleEdit}
              >
               Edit
              </LoadingButton>
              </ViewGuard>
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

            <Stack alignItems="flex-end" sx={{ mt: 3 }}></Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
