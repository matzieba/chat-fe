import React from 'react';
import { Grid, InputAdornment, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

import { LocalizationContext } from '@cvt/contexts';
import { useDebouncedQueryState } from '@cvt/hooks/useDebouncedQueryState';

export type Filters = {
  search?: string;
}

type Props = {
  children(props: {
    filters: Filters,
  }): React.ReactElement;
}

export const TeamHeader: React.FC<Props> = ({ children }) => {

  const { dictionary } = React.useContext(LocalizationContext);

  const [newSearch, currSearch, setSearch] = useDebouncedQueryState('search');

  return (
    <Grid container>
      <Grid item xs={12}>
        <TextField
          label={dictionary.filters.fieldSearch}
          value={newSearch || ''}
          onChange={({ target: { value } }) => setSearch(value.trim() === '' ? undefined : value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        {children({
          filters: {
            search: currSearch,
          },
        })}
      </Grid>
    </Grid>
  );
};
