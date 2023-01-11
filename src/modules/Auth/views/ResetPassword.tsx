import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { routes } from '@shared/routes';
import { LocalizationContext } from '@cvt/contexts';
import { emailRegex } from '@cvt/helpers/validation';

import { AuthContext } from '../contexts/AuthContext';
import { LoggedOutActionsLayout } from '../components/LoggedOutActionsLayout';


export const ResetPassword = () => {

  const navigate = useNavigate();
  const [success, setSuccess] = React.useState(false);
  const { dictionary } = React.useContext(LocalizationContext);
  const { resetPassword } = React.useContext(AuthContext);
  const { control, setError, handleSubmit, formState: { isSubmitting, errors } } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = React.useCallback(async (data: Auth.ResetPassword) => {
    try {
      resetPassword(data.email);
      setSuccess(true);
    } catch(e: any) {
      // @ts-ignore
      setError('email', { type: 'error', message: dictionary.auth.firebase.errors[e.error] || e.message });
      setSuccess(false);
    }
  }, [setError, dictionary, resetPassword]);

  return (
    <LoggedOutActionsLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="h4" align="center">{dictionary.auth.resetPassword.title}</Typography>
          </Grid>
          {success && (
            <Grid item>
              <Alert severity="success">{dictionary.auth.resetPassword.passwordResetEmailSent}</Alert>
            </Grid>
          )}
          <Grid item>
            <Controller
              name="email"
              control={control}
              rules={{
                required: dictionary.forms.validations.required,
                pattern: {
                  value: emailRegex,
                  message: dictionary.forms.validations.invalidEmail,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label={dictionary.forms.fieldEmail}
                  name="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          <br/><br/>
          <Grid item>
            <Grid container justifyContent="space-between" spacing={2}>
              <Grid item>
                <Button size="large" type="button" variant="contained" color="secondary" onClick={() => navigate(routes.auth.login)}>
                  {dictionary.auth.resetPassword.buttonLogin}
                </Button>
              </Grid>
              <div style={{ marginLeft: 'auto' }}/>
              <Grid item>
                <LoadingButton loading={isSubmitting} size="large" type="submit" variant="contained" color="primary">
                  {dictionary.auth.resetPassword.buttonReset}
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </LoggedOutActionsLayout>
  );
};
