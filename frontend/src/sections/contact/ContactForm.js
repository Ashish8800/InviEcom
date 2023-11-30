import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Grid,
  Link,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
// utils
// routes
// assets
import { countries } from "src/assets/data";
// components
import { MuiTelInput } from "mui-tel-input";
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import Vendor from "src/controller/purchase/Vendor.controller";
import apiUrls from "src/routes/apiUrls";
import { Api } from "src/utils";

// ----------------------------------------------------------------------
const INDUSTRY_OPTIONS = ["defence and aerospace", "iron and steel"];
const CUSTOMER_OPTIONS = ["reseller", "student"];

ContactForm.propTypes = {
  isEdit: PropTypes.bool,
  userId: PropTypes.string,
};

export default function ContactForm() {


  const [vendorList, setVendorList] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const ContactSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    phoneNumber: Yup.string().required("Phone number is required"),

    buy: Yup.string().required("Buy from is required"),
  });

  const defaultValues = {
    name: "",
    email: "",
    phoneNumber: "",
    buy: "",
    company: "",
    designation: "",
    industry: "",
    customer: "",
    address: "",
    country: "",
    state: "",
    city: "",
    status: "inactive",
  };

  const methods = useForm({
    resolver: yupResolver(ContactSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = async (data) => {
    Api.post(apiUrls.website.contact, data)
      .then(() => {
        enqueueSnackbar("Contact created successfully");
        reset({
          ...defaultValues,
        });

        setPhoneNumber("");
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  useEffect(() => {
    setPhoneNumberError(formState.errors.phoneNumber?.message ?? "");
  }, [formState.errors]);

  useEffect(() => {
    Vendor.list().then((res) => {
      setVendorList(res);
    });
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <List
              sx={{
                listStyleType: "disc",
                listStylePosition: "inside",
              }}
            >
              <ListItem sx={{ display: "list-item", p: 2 }}>
                Established in 2016 as a World's Leading marketplace for
                electronics.
              </ListItem>
              <ListItem sx={{ display: "list-item", p: 2 }}>
                Allow users to search accross 8million+ components and source
                from over 10 major suppliers accross the globe while comparing
                stock and price in real time.
              </ListItem>
              <ListItem sx={{ display: "list-item", p: 2 }}>
                International shipping and customs clearence handle by Semikart.
              </ListItem>
              <ListItem sx={{ display: "list-item", p: 2 }}>
                Marketing and lead generation platform to build digital traction
                for products while keeping lead time and prices as low as
                possible.
              </ListItem>
              <ListItem sx={{ display: "list-item", p: 2 }}>
                UGF-VI ,Vaishali Arcade 6, Park road,Hazratganj,Lucknow,UTTAR
                PRADESH, 226001.
              </ListItem>
              <ListItem sx={{ display: "list-item", p: 2 }}>
                contact@inevitableinfotech.com
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ m: 2 }}>
              <Stack spacing={2} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <RHFTextField name="name" fullWidth label="Name*" />

                  <RHFTextField name="email" fullWidth label="Email ID*" />
                  <MuiTelInput
                    defaultCountry="IN"
                    name="phoneNumber"
                    value={phoneNumber}
                    label="Phone Number"
                    onChange={(value) => {
                      setPhoneNumber(value);
                      setPhoneNumberError("");
                      setValue("phoneNumber", value);
                    }}
                    error={Boolean(phoneNumberError)}
                    helperText={phoneNumberError}
                  />

                  <RHFTextField
                    name="buy"
                    fullWidth
                    label="What would you like to buy from InviEcom?*"
                    multiline
                    rows={3}
                  />
                  {/* <reCAPTCHA
                    sitekey={process.env.REACT_APP_SITE_KEY}
                    ref={captchaRef}
                  /> */}
                </Stack>

                <Stack>
                  <Typography variant="h6">
                    Additional Info (Optional)
                  </Typography>
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
                  <RHFTextField name="company" label="Company" />
                  <RHFTextField name="designation" label="Designation" />

                  <RHFSelect name="industry" label="Industry Vertical">
                    {INDUSTRY_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  <RHFSelect name="customer" label="Customer Type">
                    {CUSTOMER_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  <RHFTextField name="address" label="Address" />
                  <RHFTextField name="city" label="City" />
                  <RHFTextField name="state" label="State" />

                  <RHFSelect
                    native
                    name="country"
                    label="Country"
                    placeholder="Country"
                  >
                    <option value="" />
                    {countries.map((country) => (
                      <option key={country.code} value={country.label}>
                        {country.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>
                <Stack direction="row" display="flex" justifyContent="end">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Submit
                  </LoadingButton>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ p: 3, mt: 2 }}>
        <Stack>
          <Typography variant="h6"> Our Vendors</Typography>
        </Stack>

        <Stack
          sx={{ pt: 1 }}
          display="flex"
          direction="row"
          justifyContent="space-between"
        >
          {vendorList?.map((vendor) => {
            return (
              <Typography>
                <Link noWrap variant="subtitle2" sx={{ cursor: "pointer" }}>
                  {vendor.vendorDisplayName}
                </Link>
              </Typography>
            );
          })}
        </Stack>
      </Card>
    </FormProvider>
  );
}
