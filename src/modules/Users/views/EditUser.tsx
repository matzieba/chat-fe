import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { Grid, Box, Paper, Typography, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';

import { DialogContext, LocalizationContext } from '@cvt/contexts';
import { MessageFeedbackView } from '@cvt/components/MessageFeedbackView';
import { BodyLoading } from '@cvt/components/layout/BodyLoading';
import { routes } from '@shared/routes';

import { useUserCrud } from '../hooks/useUserCrud';
import { UserForm } from '../partials/UserForm';
import { useUser } from '../hooks/useUser';


const EditUserView: React.FC<Users.User> = user => {

  const navigate = useNavigate();
  const { asyncConfirmation } = React.useContext(DialogContext);
  const { dictionary } = React.useContext(LocalizationContext);

  const { editUser, deleteUser } = useUserCrud();

  const onSubmit = React.useCallback((data: Users.Crud) => {
    return editUser({
      id: user.id,
      ...data,
    });
  }, [user, editUser]);

  const onDelete = React.useCallback(async () => {
    const userConfirmed = await asyncConfirmation({ title: dictionary.users.edit.deleteConfirmation });
    if (!user || !userConfirmed) {
      return false;
    }
    return deleteUser(user.id).then(() => {
      navigate(routes.users.list);
    });
  }, [user, deleteUser, asyncConfirmation, dictionary, navigate]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h1">{user.displayName}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <Box p={4} component={Paper}>
              <UserForm
                defaultValues={user}
                onSubmitRequest={onSubmit}
                onSubmitButtonText={dictionary.forms.buttonEdit}
                disabledFields={['email']}
              />
            </Box>
            <Box mt={2}/>
            <Button
              onClick={onDelete}
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<Delete/>}
            >
              {dictionary.users.edit.buttonDelete}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const EditUser: React.FC = () => {

  const { userId = '' } = useParams();
  const { user, status } = useUser({
    id: userId,
  });

  if (status === 'error') {
    return <MessageFeedbackView height="100vh" />;
  }

  return (
    <React.Fragment>
      {status !== 'success' || !user ? (
        <BodyLoading height="100vh"/>
      ) : (
        <EditUserView {...user} />
      )}
    </React.Fragment>
  );
};
