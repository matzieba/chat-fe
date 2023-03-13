import React from 'react';
import { Autocomplete, AutocompleteProps, AutocompleteRenderInputParams, CircularProgress, InputAdornment, TextField, TextFieldProps } from '@mui/material';

import { useCompanies } from '../hooks/useCompanies';

export type CompanyAutocompleteProps = Omit<AutocompleteProps<any, false, false, true>, 'isOptionEqualToValue' | 'getOptionLabel' | 'renderInput' | 'options' | 'onInputChange' | 'loading'> & {
  label: TextFieldProps['label'];
  TextFieldProps?: Omit<TextFieldProps, 'label'>;
  filters?: Omit<Companies.GetListParams, 'search'>;
};

export const CompanyAutocomplete: React.FC<CompanyAutocompleteProps> = ({ value, defaultValue, label, filters, TextFieldProps, ...props }) => {

  const [search, setSearch] = React.useState('');
  const { companies, status } = useCompanies({
    ...filters,
    search,
  });

  const isLoading = status === 'loading';

  return (
    <Autocomplete
      {...props}
      value={value}
      defaultValue={defaultValue}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option: Companies.Company) => option.name}
      renderInput={(props: AutocompleteRenderInputParams) =>
        <TextField
          {...props}
          {...TextFieldProps}
          label={label}
          InputProps={{
            ...props?.InputProps,
            ...TextFieldProps?.InputProps,
            endAdornment: status === 'loading' ? <InputAdornment position="end"><CircularProgress color="inherit" size={20} /></InputAdornment> : props?.InputProps?.endAdornment,
          }}
          InputLabelProps={{
            ...props?.InputLabelProps,
            ...TextFieldProps?.InputLabelProps,
          }}
        />
      }
      options={companies}
      onInputChange={(_, newValue, reason) => {
        if (reason === 'input') {
          setSearch(newValue);
        }
      }}
      filterOptions={(x) => x}
      loading={isLoading}
    />
  );
};
