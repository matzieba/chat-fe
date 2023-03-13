import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';

import { LocalizationContext } from '@cvt/contexts';
import { Permissioned } from '@cvt/components/Permissioned';

import { routes } from '@shared/routes';

import { CompaniesHeader } from './partials/CompaniesHeader';
import { CompaniesList } from './CompaniesList';


export const Companies = () => {

  const navigate = useNavigate();

  const { dictionary } = React.useContext(LocalizationContext);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h1">{dictionary.companies.list.title}</Typography>
        <Stack spacing={1} direction="row">
          <Permissioned permission="companies.create">
            <Button
              size="medium"
              variant="contained"
              color="secondary"
              onClick={() => navigate(routes.companies.create)}
              startIcon={<Add/>}
            >
              {dictionary.companies.create.buttonCreate}
            </Button>
          </Permissioned>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <CompaniesHeader>
          {({ filters }) => (
            <Box mt={2}>
              <CompaniesList filters={filters}/>
            </Box>
          )}
        </CompaniesHeader>
      </Grid>
    </Grid>
  );
};
