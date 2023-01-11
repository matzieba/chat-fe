import React from 'react';
import { Grid, Box, Paper, Typography } from '@mui/material';

import { LocalizationContext } from '@cvt/contexts';

import { useUserCrud } from '../hooks/useUserCrud';
import { UserForm } from '../partials/UserForm';


export const CreateUser: React.FC = () => {

  const { dictionary } = React.useContext(LocalizationContext);

  const { createUser } = useUserCrud();

  const onSubmit = React.useCallback((data: Users.Crud) => {
    return createUser(data);
  }, [createUser]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1">{dictionary.users.create.title}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <Box p={4} component={Paper}>
              <UserForm
                onSubmitRequest={onSubmit}
                onSubmitButtonText={dictionary.users.create.buttonCreate}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
