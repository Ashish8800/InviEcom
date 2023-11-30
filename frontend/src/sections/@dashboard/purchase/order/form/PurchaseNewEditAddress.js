import PropTypes from "prop-types";
import { useState } from "react";
// form
import { useFormContext } from "react-hook-form";
// @mui
import { Button, Divider, Stack, Typography } from "@mui/material";
// hooks
import useResponsive from "../../../../../hooks/useResponsive";
// _mock
import {
  _purchaseAddressFrom,
  _purchaseAddressTo,
} from "../../../../../_mock/arrays";
// components
import Iconify from "../../../../../components/iconify";
//
import PurchaseAddressListDialog from "./OrderAddressListDialog";

// ----------------------------------------------------------------------

export default function PurchaseNewEditAddress() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const upMd = useResponsive("up", "md");

  const values = watch();

  const { purchaseFrom, purchaseTo } = values;

  const [openFrom, setOpenFrom] = useState(false);

  const [openTo, setOpenTo] = useState(false);

  const handleOpenFrom = () => {
    setOpenFrom(true);
  };

  const handleCloseFrom = () => {
    setOpenFrom(false);
  };

  const handleOpenTo = () => {
    setOpenTo(true);
  };

  const handleCloseTo = () => {
    setOpenTo(false);
  };

  return (
    <Stack
      spacing={{ xs: 2, md: 5 }}
      direction={{ xs: "column", md: "row" }}
      divider={
        <Divider
          flexItem
          orientation={upMd ? "vertical" : "horizontal"}
          sx={{ borderStyle: "dashed" }}
        />
      }
      sx={{ p: 3 }}
    >
      <Stack sx={{ width: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Typography variant="h6" sx={{ color: "text.disabled" }}>
            From:
          </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={handleOpenFrom}
          >
            Change
          </Button>

          <PurchaseAddressListDialog
            open={openFrom}
            onClose={handleCloseFrom}
            selected={(selectedId) => purchaseFrom?.id === selectedId}
            onSelect={(address) => setValue("purchaseFrom", address)}
            addressOptions={_purchaseAddressFrom}
          />
        </Stack>

        <AddressInfo
          name={purchaseFrom.name}
          address={purchaseFrom.address}
          phone={purchaseFrom.phone}
        />
      </Stack>

      <Stack sx={{ width: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Typography variant="h6" sx={{ color: "text.disabled" }}>
            To:
          </Typography>

          <Button
            size="small"
            startIcon={
              <Iconify icon={purchaseTo ? "eva:edit-fill" : "eva:plus-fill"} />
            }
            onClick={handleOpenTo}
          >
            {purchaseTo ? "Change" : "Add"}
          </Button>

          <PurchaseAddressListDialog
            open={openTo}
            onClose={handleCloseTo}
            selected={(selectedId) => purchaseTo?.id === selectedId}
            onSelect={(address) => setValue("purchaseTo", address)}
            addressOptions={_purchaseAddressTo}
          />
        </Stack>

        {purchaseTo ? (
          <AddressInfo
            name={purchaseTo.name}
            address={purchaseTo.address}
            phone={purchaseTo.phone}
          />
        ) : (
          <Typography typography="caption" sx={{ color: "error.main" }}>
            {errors.purchaseTo?.message}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

AddressInfo.propTypes = {
  name: PropTypes.string,
  phone: PropTypes.string,
  address: PropTypes.string,
};

function AddressInfo({ name, address, phone }) {
  return (
    <>
      <Typography variant="subtitle2">{name}</Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        {address}
      </Typography>
      <Typography variant="body2">Phone: {phone}</Typography>
    </>
  );
}
