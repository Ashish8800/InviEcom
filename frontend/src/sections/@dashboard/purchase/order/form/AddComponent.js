import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
// assets
import { useEffect, useState } from "react";
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import { useTable } from "src/components/table";
import Tax from "src/controller/settings/Tax.controller";

// ----------------------------------------------------------------------

// const TABLE_HEAD = [
//   { id: "componentDescription", label: "Component Description", align: "left" },
//   { id: "quantity", label: " Quantity", align: "left" },
//   { id: "unitPrice", label: "Unit Price", align: "left" },
//   { id: "tax", label: "Tax (%)", align: "left" },
//   { id: "amount", label: "Amount", align: "left" },
// ];

const TABLE_HEAD = [
  "",
  "Quotation No.",
  "Vender",
  "Req Quantity",
  "Quoted Quantity",
  "Unit Price",
  "Lead Time",
];

AddComponent.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function AddComponent({ open, onClose, data }) {
  const FormValidationSchema = Yup.object().shape({
    name: Yup.string().required("Fullname is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    pincode: Yup.string().required("Pin code is required"),
  });

  const [taxList, setTaxList] = useState([]);
  const [requestError, setRequestError] = useState("");
  const [purchaseRequestList, setPurchaseRequestList] = useState([]);
  let isEdit = typeof data == "object" ? true : false;

  const [ipnDetails, setIpnDetails] = useState({
    description: "-",
    requestedQty: "-",
  });

  const defaultValues = {
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    status: false,
  };

  const methods = useForm({
    resolver: yupResolver(FormValidationSchema),
    defaultValues,
  });

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectAllRows,
    //
    onSort,
  } = useTable();

  const {
    setValue,
    handleSubmit,
    formState,
    formState: { isSubmitting },
    reset,
  } = methods;

  const [tableData, setTableData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);

  const onSubmit = async (data) => {
    console.log("Form Submit: ", data);
  };

  useEffect(() => {
    Tax.list().then((res) => {
      setTaxList(res.taxList);
    }); 
  }, []);

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("address", data.address);
      setValue("city", data.city);
      setValue("state", data.state);
      setValue("country", data.country);
      setValue("pincode", data.pincode);
      setValue("status", data.status == "active" ? true : false);
    } else {
      reset({
        name: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });
    }
  }, [data]);

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle> Add Component </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2} py={2}>
            <RHFSelect small name="ipn" label="IPN" size="small">
              {purchaseRequestList?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.title}
                </MenuItem>
              ))}
            </RHFSelect>

            <Stack
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Description:
                </Typography>
                <Typography>{ipnDetails.description}</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Requested Quantity:
                </Typography>
                <Typography>{ipnDetails.requestedQty}</Typography>
              </Stack>
            </Stack>

            <Divider sx={{ borderStyle: "dashed" }} />
            <Typography variant="h5">Quotations By Vendors</Typography>

            <TableContainer>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    {TABLE_HEAD.map((item) => (
                      <TableCell key={item}>{item}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>123456890987654</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Item</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Stack
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField size="small" name="quantity" label="PO Quantity" />
              <RHFSelect size="small" name="taxRate" label="Tax">
                {taxList?.map((option) => (
                  <MenuItem key={option} value={option.rate}>
                    {option.name} ({option.rate})
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
          </Stack>
        </DialogContent>
        <Divider />

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Add
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
