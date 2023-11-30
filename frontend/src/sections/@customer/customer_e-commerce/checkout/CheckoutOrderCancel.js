import PropTypes from "prop-types";
// @mui
import { Button, Divider, Typography, Stack, Link } from "@mui/material";
// components
import Iconify from "../../../../components/iconify";
import { DialogAnimate } from "../../../../components/animate";
// assets
import  OrderCancel  from "src/assets/illustrations/OrderCancel";
import { useNavigate } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { PATH_CUSTOMER } from "src/routes/paths";

// ----------------------------------------------------------------------

CheckoutOrderCancel.propTypes = {
  open: PropTypes.bool,
  order: PropTypes.object,
  onDownloadPDF: PropTypes.func,
  onReset: PropTypes.func,
};

export default function CheckoutOrderCancel({
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
        <Typography variant="h4">Oops! Payment Failed</Typography>

        <OrderCancel sx={{ height: 260 }} />

        <Typography>
        Oops! Payment Failed
          <br />
          <br />
          <Typography variant="h6">Order Id</Typography>
          <Link component={RouterLink} to={PATH_CUSTOMER.order.view(order?.id)}>
            {order?.id}
          </Link>
          <br />
          <br />
          Something went wrong.It may be due to any of these reasons.
          <br /> Session expired due to inactivity.
           <br /> <br />
         Our system Encountered an obstacle
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
           Home
          </Button>

          <Button
            fullWidth
            size="large"
            variant="contained"
            // startIcon={<Iconify icon="ant-design:file-pdf-filled" />}
            onClick={onDownloadPDF}
          >
            Retry
          </Button>
        </Stack>
      </Stack>
    </DialogAnimate>
  );
}
