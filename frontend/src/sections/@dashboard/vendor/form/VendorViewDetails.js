import sum from "lodash/sum";
import { useCallback, useEffect, useState } from "react";
// form
import { useFormContext, useFieldArray } from "react-hook-form";
// @mui
import { Box, Stack, Grid, Card, Typography, MenuItem } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";

import { countries } from "src/assets/data";
// utils
// components
import { RHFSelect, RHFTextField } from "../../../../components/hook-form";
import Tax from "src/controller/settings/Tax.controller";
import Currency from "src/controller/settings/Currency.controller";

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  { id: 1, name: "full stack development", price: 90.99 },
  { id: 2, name: "backend development", price: 80.99 },
  { id: 3, name: "ui design", price: 70.99 },
  { id: 4, name: "ui/ux design", price: 60.99 },
  { id: 5, name: "front end development", price: 40.99 },
];

const CURRENCY = ["dollar", "rupees"];
const SALUTATION = ["Mr", "Mrs", "Miss"];

// ----------------------------------------------------------------------

export default function VendorViewDetails() {
  const { control, setValue, watch, resetField } = useFormContext();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contectPhoneNumber, setContectPhoneNumber] = useState("");
  const [taxList, setTaxList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const values = watch();

  const handlePhoneChange = (newNumber) => {
    setPhoneNumber(newNumber);
    setValue("phoneNumber", newNumber);
  };

  useEffect(() => {
    setPhoneNumber(values.phoneNumber);
    setContectPhoneNumber(values.contactNumber);
  }, [values]);
  useEffect(() => {
    Tax.list().then((res) => {
      setTaxList(res.taxList);
    });

    Currency.list().then((data) => {
      console.log(data);
      setCurrencyList(data);
    });
  }, []);

  useEffect(() => {}, []);

  return (
    <Grid item xs={12} md={8}>
      <Card sx={{ p: 3 }}>
        <Box
          rowGap={2}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
        >
          <Stack>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <RHFSelect 
                  disabled="true"
                  size="small" name="salutation" label="Salutation">
                  {SALUTATION.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={9}>
                <RHFTextField
                  disabled="true"
                  size="small"
                  name="firstName"
                  label="First Name"
                ></RHFTextField>
              </Grid>
            </Grid>
          </Stack>

          <RHFTextField
            disabled="true"
            size="small"
            name="lastName"
            label="Last Name"
          />
          <RHFTextField
            disabled="true"
            size="small"
            name="companyName"
            label="Company Name"
          />
          <RHFTextField
            disabled="true"
            size="small"
            name="vendorDisplayName"
            label="Vendor Display Name"
          />
          <RHFTextField
            disabled="true"
            size="small"
            name="vendorEmail"
            label="Vendor Email ID"
          />
          <RHFSelect disabled="true" size="small" name="taxRate" label="Tax">
            {taxList?.map((option) => (
              <MenuItem key={option} value={option.rate}>
                {option.rate}
              </MenuItem>
            ))}
          </RHFSelect>

          <MuiTelInput
            size="small"
            defaultCountry="IN"
            name="phoneNumber"
            value={phoneNumber}
            label="Vendor Contact"
            onChange={handlePhoneChange}
            disabled="true"
          />

          <RHFSelect
            disabled="true"
            size="small"
            name="currency"
            label="Currency"
          >
            {currencyList?.map((option, i) => {
              console.log(option);
              return (
                <MenuItem key={i} value={option.name}>
                  {option.name} ({option.symbol})
                </MenuItem>
              );
            })}
          </RHFSelect>
          <RHFTextField
            disabled="true"
            size="small"
            name="website"
            label="Website"
          />
          <RHFTextField disabled="true" size="small" name="pan" label="PAN" />
        </Box>

        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
          sx={{ mt: 2, mb: 1 }}
        >
          <Card sx={{ backgroundColor: "#fbfbfb", p: 2 }}>
            <Stack gap={1}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Billing Address
              </Typography>
              <RHFTextField
                disabled="true"
                size="small"
                name="billing.address"
                label="Address"
              />
              <RHFTextField
                disabled="true"
                size="small"
                name="billing.city"
                label="City"
              />
              <RHFTextField
                disabled="true"
                size="small"
                name="billing.state"
                label="State"
              />
              <RHFSelect
                disabled="true"
                size="small"
                native
                name="billing.country"
                label="Country"
              >
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField
                disabled="true"
                size="small"
                name="billing.pincode"
                label="Pin Code"
              />
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#fbfbfb", p: 2 }}>
            <Stack gap={1}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Shipping Address
              </Typography>
              <RHFTextField
                disabled="true"
                size="small"
                name="shipping.address"
                label="Address"
              />
              <RHFTextField
                disabled="true"
                size="small"
                name="shipping.city"
                label="City"
              />
              <RHFTextField
                disabled="true"
                size="small"
                name="shipping.state"
                label="State"
              />
              <RHFSelect
                disabled="true"
                size="small"
                native
                name="shipping.country"
                label="Country"
              >
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField
                disabled="true"
                size="small"
                name="shipping.pincode"
                label="Pin Code"
              />
            </Stack>
          </Card>
        </Box>
        <Stack p={2}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Contact Person
          </Typography>
          <Box
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFTextField
              disabled="true"
              size="small"
              name="contactFirstName"
              label="First Name"
            />
            <RHFTextField
              disabled="true"
              size="small"
              name="contactLastName"
              label="Last Name"
            />
            <MuiTelInput
             disabled="true"
              size="small"
              defaultCountry="IN"
              name="contactNumber"
              value={contectPhoneNumber}
              label="Contact Number"
              onChange={(number) => {
                setValue("contactNumber", number);
                setContectPhoneNumber(number);
              }}
            />

            <RHFTextField
              disabled="true"
              size="small"
              name="contactEmail"
              label="Email Address"
            />
          </Box>
        </Stack>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          {/* <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Add ' : 'Save Changes'}
              </LoadingButton> */}
        </Stack>
      </Card>
    </Grid>
  );
}
