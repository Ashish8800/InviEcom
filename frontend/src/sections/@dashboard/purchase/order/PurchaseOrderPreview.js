import PropTypes from "prop-types";
// form
// @mui
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
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
import { styled } from "@mui/system";
import { useState } from "react";
import Image from "src/components/image/Image";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import { fCurrency } from "src/utils/formatNumber";

// ----------------------------------------------------------------------
const StyledRowResult = styled(TableRow)(({ theme }) => ({
  "& td": {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const TABLE_HEAD = [
  { id: "componentDescription", label: "Component Description", align: "left" },
  { id: "quantity", label: " Quantity", align: "left" },
  { id: "unitPrice", label: "Unit Price", align: "left" },
  { id: "tax", label: "Tax (%)", align: "left" },
  { id: "amount", label: "Amount", align: "left" },
];

PurchaseOrderPreview.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
  isDialog: PropTypes.bool,
};

export default function PurchaseOrderPreview({
  open,
  onClose,
  data,
  isDialog,
}) {
  isDialog = isDialog || false;

  return isDialog ? (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <DialogTitle>Purchase Order</DialogTitle>

      <DialogContent dividers>
        <PurchaseOrderPreviewDetails data={data} />
      </DialogContent>

      <DialogActions>
        <Button color="error" variant="contained" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  ) : (
    <PurchaseOrderPreviewDetails data={data} />
  );
}

PurchaseOrderPreviewDetails.propTypes = {
  data: PropTypes.object,
};

function PurchaseOrderPreviewDetails({ data }) {
  const [tableData, setTableData] = useState([]);
  return (
    <Stack spacing={1} sx={{ p: 2 }}>
      <Stack
        sx={{ pb: 2 }}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
        }}
      ></Stack>

      <Grid container justifyContent="space-between">
        <Grid item xs={4} md={6}>
          <Stack spacing={2} direction="row">
            <Stack>
              <Image
                fullWidth
                disabledEffect
                alt="logo"
                src="/logo/Logo_Full-01.svg"
                sx={{ maxWidth: 250 }}
              />
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={4} md={6}>
          <Stack spacing={2}>
            <Stack>
              <Typography variant="subtitle2">
                Inevitable Electronics Pvt Ltd
              </Typography>

              <Typography variant="body2">
                482, 10th Main, 40th Cross Rd, 5th Block
              </Typography>
              <Typography variant="body2">
                Jayanagar, Bengaluru, Karnataka 560041
              </Typography>

              <Typography variant="body2">Phone: 234567890-</Typography>
              <Typography variant="body2">
                Email: contact@inevitableelectronics.com-
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
        <Grid item xs={4} md={6}>
          <Stack spacing={2} sx={{ pt: 2 }}>
            <Stack>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  Vendor Name:
                </Typography>

                <Typography variant="body2">Abhishek singh</Typography>
              </Stack>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  Display Name:
                </Typography>

                <Typography variant="body2">Aniket</Typography>
              </Stack>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  Contact Number :
                </Typography>

                <Typography variant="body2">9876543225</Typography>
              </Stack>

              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  Email Id :
                </Typography>

                <Typography variant="body2">
                  Shruti@inevitableInfotech.com
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography
                  paragraph
                  variant="subtitle1"
                  sx={{ color: "text.disabled", pr: 1 }}
                >
                  Address :
                </Typography>

                <Typography variant="body2">
                  Hazratganj,Lucknow,Uttar Pradesh
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={4} md={6}>
          <Stack>
            <Stack direction="row">
              <Typography
                paragraph
                variant="subtitle1"
                sx={{ color: "text.disabled", pr: 1 }}
              >
                RFQ No.:
              </Typography>

              <Typography variant="body2">RFQ0987654</Typography>
            </Stack>
            <Stack direction="row">
              <Typography
                paragraph
                variant="subtitle1"
                sx={{ color: "text.disabled", pr: 1 }}
              >
                Dated :
              </Typography>

              <Typography variant="body2">18-6-2023</Typography>
            </Stack>

            <Stack direction="row">
              <Typography
                paragraph
                variant="subtitle1"
                sx={{ color: "text.disabled", pr: 1 }}
              >
                Other Reference :
              </Typography>

              <Typography variant="body2">12345SD#$XGF</Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <TableContainer sx={{ overflow: "unset" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 960 }}>
            <TableHead
              sx={{
                borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                "& th": { backgroundColor: "transparent" },
              }}
            >
              <TableRow>
                <TableCell align="left" width={40}>
                  Sr.No
                </TableCell>

                <TableCell align="left">Component Description</TableCell>

                <TableCell align="left">Quantity</TableCell>
                <TableCell align="left">Unit Price</TableCell>
                <TableCell align="left">Tax (%)</TableCell>

                <TableCell align="left">Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    borderBottom: (theme) =>
                      `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <TableCell>{index + 1}</TableCell>

                  <TableCell align="left">
                    <Box sx={{ maxWidth: 560 }}>
                      <Typography variant="subtitle2">{row.title}</Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                        noWrap
                      >
                        {row.description}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="left">{row.quantity}</TableCell>

                  <TableCell align="left">{fCurrency(row.price)}</TableCell>

                  <TableCell align="left">
                    {fCurrency(row.price * row.quantity)}
                  </TableCell>
                  <TableCell align="left">
                    {fCurrency(row.price * row.quantity)}
                  </TableCell>
                </TableRow>
              ))}

              <StyledRowResult>
                <TableCell colSpan={4} />

                <TableCell align="left" sx={{ typography: "h6" }}>
                  Total
                </TableCell>

                <TableCell align="left" width={140} sx={{ typography: "h6" }}>
                  {fCurrency(100000)}
                </TableCell>
              </StyledRowResult>
            </TableBody>
          </Table>
        </Scrollbar>
        <Divider sx={{ mt: 1 }} />
        <Stack>
          <Typography variant="subtitle2">
            Amount Chargeable (in words){" "}
          </Typography>

          <Typography variant="body2">
            INR Two Lakh Eighty Seven thousand rupees
          </Typography>
          <Typography variant="body2">Fifteen and Thirty Paise only</Typography>
        </Stack>
      </TableContainer>

      <Grid container sx={{ pt: 15 }}>
        <Grid item xs={12} md={9} sx={{ py: 3 }}>
          <Typography variant="subtitle2"> Terms Of Delivery</Typography>

          <Typography variant="body2">
            These Terms and Conditions (also, “Disclaimer”) are a legally
            binding document between the User of the website and Ecom Express
            Private Limited. .
          </Typography>
        </Grid>

        <Grid item xs={12} md={3} sx={{ py: 3, textAlign: "right" }}>
          <Typography variant="subtitle2">
            {" "}
            Inevitable Electronics Pvt Ltd
          </Typography>

          <Typography variant="body2">Authorised Signatory</Typography>
        </Grid>
      </Grid>
    </Stack>
  );
}
