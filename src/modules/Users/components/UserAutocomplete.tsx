import React from 'react';
import { Autocomplete, AutocompleteProps, AutocompleteRenderInputParams, Avatar, Box, CircularProgress, InputAdornment, TextField, TextFieldProps } from '@mui/material';

import { useUsers } from '../hooks/useUsers';

import { UserSelectOption, Props as UserSelectOptionProps } from './UserSelectOption';

export type UserAutocompleteProps = Omit<AutocompleteProps<any, boolean, false, true>, 'isOptionEqualToValue' | 'getOptionLabel' | 'renderInput' | 'options' | 'onInputChange' | 'loading'> & {
  label?: TextFieldProps['label'];
  TextFieldProps?: TextFieldProps;
  filters?: Users.GetListParams;
  UserSelectOptionProps?: Omit<UserSelectOptionProps, 'user'>;
};

export const UserAutocomplete: React.FC<UserAutocompleteProps> = ({ value, defaultValue, label, filters, TextFieldProps, UserSelectOptionProps, ...props }) => {

  const [search, setSearch] = React.useState('');
  const { users, status } = useUsers({
    ...filters,
    search: search,
  });


  const isLoading = status === 'loading';

  return (
    <Autocomplete
      {...props}
      value={value}
      defaultValue={defaultValue}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option: Users.User) => option.displayName}
      renderOption={(props, option: Users.User) => <UserSelectOption user={option} {...props} {...UserSelectOptionProps} key={option.id}/>}
      renderInput={(props: AutocompleteRenderInputParams) =>
        <TextField
          {...props}
          {...TextFieldProps}
          label={label}
          InputProps={{
            ...TextFieldProps?.InputProps,
            ...props?.InputProps,
            startAdornment: props?.InputProps?.startAdornment || (value ? (
              <InputAdornment position="start">
                <Box ml={1}>
                  <Avatar alt={value.displayName} src={value.profilePicture} sx={{ width: 24, height: 24 }}/>
                </Box>
              </InputAdornment>
            ) : TextFieldProps?.InputProps?.startAdornment),
            endAdornment: isLoading ? <InputAdornment position="end"><CircularProgress color="inherit" size={20} /></InputAdornment> : props?.InputProps?.endAdornment,
          }}
        />
      }
      options={users}
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
