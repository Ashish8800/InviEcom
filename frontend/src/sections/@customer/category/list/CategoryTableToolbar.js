import PropTypes from "prop-types";
import { sentenceCase } from "change-case";
// @mui
import {
  Stack,
  Button,
  Select,
  MenuItem,
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
  manufacturers: PropTypes.arrayOf(PropTypes.string),
  filterRole: PropTypes.string,
  onFilterManufacturer: PropTypes.func,
};

export default function CategoryTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  manufacturers,
  onFilterManufacturer,
  filterRole,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: "column",
        md: "row",
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        select
        label="Manufacturer"
        placeholder="manufacturer"
        value={filterRole}
        onChange={onFilterManufacturer}
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
          maxWidth: { sm: 360 },
          textTransform: "capitalize",
        }}
      >
        <MenuItem
          value={"all"}
          sx={{
            mx: 1,
            borderRadius: 0.75,
            typography: "body2",
            textTransform: "capitalize",
          }}
        >
          All
        </MenuItem>
        {manufacturers.map((option) => (
          <MenuItem
            key={option.id}
            value={option.id}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: "body2",
              textTransform: "capitalize",
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </TextField>

      <FormControl
        sx={{
          width: { xs: 1, md: 360 },
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
