import React from 'react';
import { Grid, Box, Paper, Typography } from '@mui/material';

import { LocalizationContext } from '@cvt/contexts';
import { BodyLoading } from '@cvt/components/layout/BodyLoading';

import { useMe } from '@modules/Auth/hooks/useMe';

import { useUserCrud } from '../hooks/useUserCrud';
import { UserForm } from '../partials/UserForm';

export const Profile: React.FC = () => {

  const { dictionary } = React.useContext(LocalizationContext);
  const { user, status } = useMe();

  const { editUser } = useUserCrud();

  const onSubmit = React.useCallback((data: Users.Crud) => {
    if (!user) {
      return false;
    }
    return editUser({
      ...data,
      id: user.id,
    });
  }, [user, editUser]);

  return (
    <React.Fragment>
      {status !== 'success' || !user ? (
        <BodyLoading height="100vh"/>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1">{user.displayName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={8}>
                <Box p={4} component={Paper}>
                  <UserForm
                    defaultValues={{
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                      // jobTitle: user.jobTitle,
                      // company: user.company,
                      type: user.type,
                      profilePicture: user.profilePicture,
                    }}
                    disabledFields={['type']}
                    onSubmitRequest={onSubmit}
                    onSubmitButtonText={dictionary.forms.buttonEdit}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
};
