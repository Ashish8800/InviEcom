import PropTypes from "prop-types";
import * as Yup from "yup";
import { useEffect, useState } from "react";
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
  IconButton,
  Link,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import Iconify from "src/components/iconify";

// utils
// routes
// assets
import { countries } from "src/assets/data";
import { useRef } from "react";
// components
import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import { MuiTelInput } from "mui-tel-input";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import reCAPTCHA from "react-google-recaptcha";
import RestApiClient from "src/utils/RestApiClient";

import apiUrls from "src/routes/apiUrls";
import Vendor from "src/controller/purchase/Vendor.controller";
import { Api } from "src/utils";
import { convertHtmlToText, formateDate } from "src/utils";
import Policy from "src/controller/settings/Policy.controller";

// ----------------------------------------------------------------------
const INDUSTRY_OPTIONS = ["defence and aerospace", "iron and steel"];
const CUSTOMER_OPTIONS = ["reseller", "student"];

PolicyDetails.propTypes = {
  isEdit: PropTypes.bool,
  userId: PropTypes.string,
};

export default function PolicyDetails({ open, data, onClose }) {
 
  


 
  return (
   <Card sx={{ p: 2 }}>
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
        </Stack>
        <Divider/>
        <Stack>{convertHtmlToText(data?.description)}</Stack>
      </Card>
      
  );
}
