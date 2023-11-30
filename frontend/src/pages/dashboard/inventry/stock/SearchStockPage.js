import PropTypes from "prop-types";
// form
// @mui
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
// assets
import { useEffect, useState } from "react";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import Item from "src/controller/inventory/Item.controller";
import Stock from "src/controller/inventory/Stock.controller";
// ----------------------------------------------------------------------

SearchStockPage.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function SearchStockPage({ open, data, onClose }) {
  const [ipnList, setIpnList] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [inputIpn, setInputIpn] = useState(null);

  useEffect(() => {
    Item.list()
      .then((data) => {
        setIpnList(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Search Stock</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack
            spacing={1}
            display="flex"
            justifyContent="space-between"
            direction="row"
          >
            <Autocomplete
              value={inputIpn}
              options={ipnList}
              getOptionLabel={(option) =>
                typeof option == "object"
                  ? `${option.ipn} [ ${option.shortDescription} ]`
                  : option
              }
              isOptionEqualToValue={(option, value) => option.ipn === value}
              fullWidth
              onChange={(event, newValue) => {
                setInputIpn(newValue);
                Stock.list(`?ipn=${newValue.ipn}`)
                  .then((res) => setStockList(res))
                  .catch((err) => console.log("nothing found in warehouse"));
              }}
              renderInput={(params) => <TextField {...params} label="IPN" />}
            />
          </Stack>

          {stockList.length > 0 && (
            <Scrollbar>
              <Table size={"small"} sx={{ minWidth: 80 }}>
                <TableHead>
                  <TableRow>
                    <TableCell width="140px" align="center">
                      Warehouse
                    </TableCell>
                    <TableCell width="140px" align="center">
                      Stock
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockList.map((item) => (
                    <TableRow>
                      <TableCell align="center">
                        {item.warehouse ?? "-"}
                      </TableCell>
                      <TableCell align="center">{item.stock ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          )}
        </Stack>
      </DialogContent>

      <Stack
        display="flex"
        justifyContent="flex-end"
        direction="row"
        alignItems="center"
      >
        <DialogActions>
          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
