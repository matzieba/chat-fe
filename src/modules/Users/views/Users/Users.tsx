import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';

import { DialogContext, LocalizationContext, PermissionContext } from '@cvt/contexts';

import { routes } from '@shared/routes';

import { UsersHeader } from './partials/UsersHeader';
import { UsersList } from './UsersList';


export const Users = () => {

  const navigate = useNavigate();

  const { dictionary } = React.useContext(LocalizationContext);
  const { openDialog } = React.useContext(DialogContext);
  const { permissions } = React.useContext(PermissionContext);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h1">{dictionary.users.team.title}</Typography>
        <Stack spacing={1} direction="row">
          {permissions.users.create && (
            <Button
              size="medium"
              variant="contained"
              color="secondary"
              onClick={() => navigate(routes.users.create)}
              startIcon={<Add/>}
            >
              {dictionary.users.create.buttonCreate}
            </Button>
          )}
          {permissions.users.invite && (
            <Button
              size="medium"
              variant="contained"
              color="primary"
              onClick={() => openDialog('inviteTeamMember')}
              startIcon={<Add/>}
            >
              {dictionary.users.team.buttonInvite}
            </Button>
          )}
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <UsersHeader>
          {({ filters }) => (
            <Box mt={2}>
              <UsersList filters={filters}/>
            </Box>
          )}
        </UsersHeader>
      </Grid>
    </Grid>
  );
};
