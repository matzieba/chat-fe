import React from 'react';
import { Grid, Box, Paper, Typography } from '@mui/material';

import { LocalizationContext } from '@cvt/contexts';

import { useCompanyCrud } from '../hooks/useCompanyCrud';
import { CompanyForm } from '../partials/CompanyForm';


export const CreateCompany: React.FC = () => {

  const { dictionary } = React.useContext(LocalizationContext);

  const { createCompany } = useCompanyCrud();

  const onSubmit = React.useCallback((data: Companies.Crud) => {
    return createCompany(data);
  }, [createCompany]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h1">{dictionary.companies.create.title}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <Box p={4} component={Paper}>
              <CompanyForm
                onSubmitRequest={onSubmit}
                onSubmitButtonText={dictionary.companies.create.buttonCreate}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
