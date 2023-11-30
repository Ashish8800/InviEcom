import PropTypes from "prop-types";
// @mui
import {
  Card,
  Button,
  Box,
  MenuItem,
  Typography,
  Stack,
  Select,
  CardHeader,
  CardContent,
  TextField,
} from "@mui/material";
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadAvatar,
} from "src/components/hook-form";
// components
import Iconify from "../../../../../components/iconify";
import { MuiTelInput } from "mui-tel-input";

import { useState } from "react";
import { countries } from "src/assets/data";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// ----------------------------------------------------------------------

CheckoutBillingInfo.propTypes = {
  billing: PropTypes.object,
  onBackStep: PropTypes.func,
};

export default function CheckoutBillingInfo({ billing, onBackStep }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isEditBillingAddress, setIsEditBillingAddress] = useState(false);

  const handleSaveBillingAddress = () => {
    setIsEditBillingAddress(false);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Shipping Address"
        action={
          !isEditBillingAddress && (
            <Button
              size="small"
              startIcon={<Iconify icon="eva:edit-fill" />}
              onClick={() => {
                setIsEditBillingAddress(true);
              }}
            >
              Edit
            </Button>
          )
        }
      />
      <CardContent>
        {!isEditBillingAddress ? (
          <Stack>
            <Typography variant="subtitle2" gutterBottom>
              Rishabh Yadav
              {/* {shipping?.receiver}&nbsp; */}
              {/* <Typography
              component="span"
              variant="body2"
              sx={{ color: "text.secondary" }}
            >
              (Office)
              ({shipping?.addressType})
            </Typography> */}
            </Typography>

            <Typography variant="body2" gutterBottom>
              545DKU, Aashiyana, Lucknow
              {/* {shipping?.fullAddress} */}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              9876543212
              {/* {shipping?.phoneNumber} */}
            </Typography>
          </Stack>
        ) : (
          <Stack>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <TextField size="small" name="name" label="Name" />
              {/* <Select fullWidth name="role" label="Role">
              {rolesList.map((option) => (
                <MenuItem key={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </Select> */}

              <MuiTelInput
                size="small"
                defaultCountry="IN"
                name="phoneNumber"
                value={phoneNumber}
                label="Contact#"
                onChange={(value) => {
                  setPhoneNumber(value);
                  setPhoneNumberError("");
                  // setValue("phoneNumber", value);
                }}
                error={Boolean(phoneNumberError)}
                helperText={phoneNumberError}
              />
              <TextField size="small" name="address" label="Address" />
              <TextField size="small" name="state" label="State/Region" />
              <TextField size="small" name="city" label="City" />

              <FormControl  size="small">
                <InputLabel id="country" alignItem="center">
                  Country
                </InputLabel>
                <Select
                  labelId="country"
                  id="country"
                  native
                  // size="small"
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
                </Select>
              </FormControl>
            </Box>

            <Stack
              display="flex"
              justifyContent="flex-end"
              direction="row"
              sx={{ pt: 2 }}
            >
              <Button
                variant="contained"
                size="medium"
                onClick={handleSaveBillingAddress}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
