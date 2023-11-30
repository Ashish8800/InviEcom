import PropTypes from "prop-types";
import {
  Stack,
  InputAdornment,
  TextField,
  MenuItem,
  Button,
  Typography
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
// components
import Iconify from "../../../../components/iconify";


// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

OrderTableToolbar1.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterService: PropTypes.string,
  onFilterEndDate: PropTypes.func,
  onFilterService: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  filterEndDate: PropTypes.instanceOf(Date),
  filterStartDate: PropTypes.instanceOf(Date),
  optionsService: PropTypes.arrayOf(PropTypes.string),
};

export default function OrderTableToolbar1({
  isFiltered,
  filterName,
  onFilterName,
  filterEndDate,
  filterService,
  onResetFilter,
  optionsService,
  filterStartDate,
  onFilterService,
  onFilterEndDate,
  onFilterStartDate,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      backgroundColor="#FFF5CC"
      // direction={{
      //   xs: "column",
      //   md: "row",
      // }}
      sx={{ px: 2.5, py: 3 }}
    >

     
       <Typography>
       PO Approval Bucket
       </Typography>
    

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )}

     
    </Stack>
  );
}
