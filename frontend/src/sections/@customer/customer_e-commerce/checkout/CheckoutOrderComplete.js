import PropTypes from "prop-types";
// @mui
import { Button, Divider, Typography, Stack, Link } from "@mui/material";
// components
import Iconify from "../../../../components/iconify";
import { DialogAnimate } from "../../../../components/animate";
// assets
import { OrderCompleteIllustration } from "../../../../assets/illustrations";
import { useNavigate } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { PATH_CUSTOMER } from "src/routes/paths";

// ----------------------------------------------------------------------

CheckoutOrderComplete.propTypes = {
  open: PropTypes.bool,
  order: PropTypes.object,
  onDownloadPDF: PropTypes.func,
  onReset: PropTypes.func,
};

export default function CheckoutOrderComplete({
  open,
  order,
  onReset,
  onDownloadPDF,
}) {
  const navigate = useNavigate();
  return (
    <DialogAnimate
      fullScreen
      open={open}
      PaperProps={{
        sx: {
          maxWidth: { md: "calc(100% - 48px)" },
          maxHeight: { md: "calc(100% - 48px)" },
        },
      }}
    >
      <Stack
        spacing={5}
        sx={{
          m: "auto",
          maxWidth: 480,
          textAlign: "center",
          px: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4">Thank you for your purchase!</Typography>

        <OrderCompleteIllustration sx={{ height: 260 }} />

        <Typography>
          Thanks for placing order
          <br />
          <br />
          <Link component={RouterLink} to={PATH_CUSTOMER.order.view(order?.id)}>
            {order?.id}
          </Link>
          <br />
          <br />
          We will send you a notification within 5 days when it ships.
          <br /> If you have any question or queries then fell to get in contact
          us. <br /> <br />
          All the best,
        </Typography>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack
          spacing={2}
          justifyContent="space-between"
          direction={{ xs: "column-reverse", sm: "row" }}
        >
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            onClick={() => {
              onReset();
              navigate(PATH_CUSTOMER.product.root);
            }}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Continue Shopping
          </Button>

          <Button
            fullWidth
            size="large"
            variant="contained"
            startIcon={<Iconify icon="ant-design:file-pdf-filled" />}
            onClick={onDownloadPDF}
          >
            Download as PDF
          </Button>
        </Stack>
      </Stack>
    </DialogAnimate>
  );
}
