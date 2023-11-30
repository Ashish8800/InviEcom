import PropTypes from "prop-types";
// form
import { Controller, useFormContext } from "react-hook-form";
// @mui
import { Autocomplete, TextField } from "@mui/material";

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
  noOptionsText: PropTypes.node,
};

export default function RHFAutocomplete({
  name,
  label,
  helperText,
  noOptionsText,
  ...other
}) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          onChange={(event, newValue) => {
            setValue(name, newValue, { shouldValidate: true });
            console.log(event, newValue);
          }}
          renderInput={(params) => (
            <TextField
              label={label}
              error={!!error}
              helperText={error ? error?.message : helperText}
              {...params}
            />
          )}
          noOptionsText={noOptionsText}
          {...other}
        />
      )}
    />
  );
}
