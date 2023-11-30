import { Button, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
// components
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

QuotationTableToolbar1.propTypes = {
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

export default function QuotationTableToolbar1({ isFiltered, onResetFilter }) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      backgroundColor="rgb(0, 171, 85)"
      sx={{ px: 2.5, py: 1.5 }}
    >
      <Typography sx={{ color: "#fff" }}>Pending For RFQ Bucket</Typography>

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
