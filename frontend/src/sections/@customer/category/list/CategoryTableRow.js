import PropTypes from "prop-types";
import { useState } from "react";
import { sentenceCase } from "change-case";
// @mui
import {
  Stack,
  Button,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  TextField,
  IconButton,
  Link,
  useStepContext,
} from "@mui/material";
// utils
import { fDate } from "../../../../utils/formatTime";
import { fCurrency } from "../../../../utils/formatNumber";
// components
import Label from "../../../../components/label";
import Image from "../../../../components/image";
import Iconify from "../../../../components/iconify";
import MenuPopover from "../../../../components/menu-popover";
import ConfirmDialog from "../../../../components/confirm-dialog";
import { formateCurrency } from "src/utils";
import { useDispatch } from "src/redux/store";
import { addToCart } from "src/redux/slices/cart";
import { isCustomerLoggedIn } from "src/auth/utils";

// ----------------------------------------------------------------------

CategoryTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function CategoryTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const dispatch = useDispatch();

  const { id, name, thumbnail: cover, createdAt, inventoryType, price } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemQtyError, setItemQtyError] = useState("");

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  let itemAvailability = 0;
  row?.warehouses?.map((item) => {
    itemAvailability += item.currentStock ?? 0;
  });

  const handleAddCart = async () => {
    // if (!isCustomerLoggedIn()) {
    //   window.openLoginModel();
    // }

    if (itemQuantity <= 0) {
      setItemQtyError("Pleas enter product quantity");
      return false;
    }

    if (itemAvailability < itemQuantity) {
      setItemQtyError(
        `Product quantity can't be grater than ${itemAvailability}`
      );
      return false;
    }

    const newProduct = {
      id,
      name,
      cover,
      available: itemAvailability,
      price: row?.saleData?.price ?? 0,
      quantity: parseInt(itemQuantity),
    };
    try {
      dispatch(addToCart(newProduct));
      setItemQuantity("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Image
              disabledEffect
              visibleByDefault
              alt={name}
              src={cover}
              sx={{ borderRadius: 1.5, width: 48, height: 48 }}
            />
          </Stack>
        </TableCell>

        <TableCell>
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: "pointer" }}
          >
            {id}
          </Link>
        </TableCell>

        <TableCell align="left">{name}</TableCell>

        <TableCell align="left">-</TableCell>
        <TableCell align="left">{itemAvailability}</TableCell>
        <TableCell align="left">
          {formateCurrency(row?.saleData?.price)}
        </TableCell>

        <TableCell align="left">
          <Stack display="flex" justifyContent="end" direction="row" gap={1}>
            <TextField
              size="small"
              placeholder="Quantity"
              type="number"
              value={itemQuantity}
              onChange={(e) => {
                setItemQuantity(e.target.value);
                setItemQtyError("");
              }}
              error={Boolean(itemQtyError)}
              helperText={itemQtyError}
            />
            <Button variant="contained" onClick={handleAddCart}>
              Buy
            </Button>
          </Stack>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
