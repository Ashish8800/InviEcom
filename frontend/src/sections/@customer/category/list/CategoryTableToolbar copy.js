import PropTypes from "prop-types";
import { sentenceCase } from "change-case";
// @mui
import {
  Stack,
  Button,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
// components
import Iconify from "../../../../components/iconify";

// ----------------------------------------------------------------------

CategoryTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  optionsRole: PropTypes.arrayOf(PropTypes.string),
  filterRole: PropTypes.string,
  onFilterRole: PropTypes.func,
};

export default function CategoryTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  optionsRole,
  onFilterRole,
  filterRole,
}) {
  return (
    <Grid container spacing={2}>
      
        <Grid item xs={12} md={4}>
          <FormControl
            sx={{
              width: { xs: 1, md: 240 },
            }}
          >
            <InputLabel sx={{ "&.Mui-focused": { color: "text.primary" } }}>
              Status
            </InputLabel>
            <Select
              multiple
              value={filterStatus}
              onChange={onFilterStatus}
              input={<OutlinedInput label="Status" />}
              renderValue={(selected) =>
                selected.map((value) => sentenceCase(value)).join(", ")
              }
            >
              {statusOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{
                    p: 0,
                    mx: 1,
                    borderRadius: 0.75,
                    typography: "body2",
                    textTransform: "capitalize",
                  }}
                >
                  <Checkbox
                    disableRipple
                    size="small"
                    checked={filterStatus.includes(option.value)}
                  />
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            label="Manufacturer"
            value={filterRole}
            onChange={onFilterRole}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    maxHeight: 260,
                  },
                },
              },
            }}
            sx={{
              maxWidth: { sm: 240 },
              textTransform: "capitalize",
            }}
          >
            {optionsRole.map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: "body2",
                  textTransform: "capitalize",
                }}
              >
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            label="Product"
            value={filterRole}
            onChange={onFilterRole}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    maxHeight: 260,
                  },
                },
              },
            }}
            sx={{
              maxWidth: { sm: 240 },
              textTransform: "capitalize",
            }}
          >
            {optionsRole.map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: "body2",
                  textTransform: "capitalize",
                }}
              >
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      /> */}

        {/* {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )} */}
    </Grid>
  );
}
