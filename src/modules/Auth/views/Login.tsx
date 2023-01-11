import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Divider, Grid, IconButton, Link, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { routes } from '@shared/routes';
import config from '@shared/config';
import { LocalizationContext } from '@cvt/contexts';
import { emailRegex } from '@cvt/helpers/validation';

import { useSignin } from '../hooks/useSignin';
import { LoggedOutActionsLayout } from '../components/LoggedOutActionsLayout';

export const Login = () => {

  const { dictionary } = React.useContext(LocalizationContext);
  const { control, setError, handleSubmit, formState: { isSubmitting, errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { signIn, signInWithSSO } = useSignin();

  const onSSOLogin = React.useCallback(async (provider: string) => {
    try {
      await signInWithSSO(provider);
    } catch (e: any) {
      // @ts-ignore
      setError('email', { type: 'error', message: dictionary.auth.firebase.errors[e.error] || e.message });
    }
  }, [signInWithSSO, setError, dictionary]);

  const onSubmit = React.useCallback (async ({ email, password }: { email: string; password: string }) => {
    try {
      await signIn(email, password);
    } catch (e: any) {
      if(['auth/invalid-email','auth/user-not-found', 'auth/wrong-password'].includes(e.error)) {
        setError('email', { type: 'error', message: dictionary.auth.validations.emailOrPasswordWrong });
        setError('password', { type: 'error', message: dictionary.auth.validations.emailOrPasswordWrong });
      } else {
        setError('email', { type: 'error', message: dictionary.errors.somethingWentWrong });
      }
    }
  }, [signIn, setError, dictionary]);

  return (
    <LoggedOutActionsLayout>
      <Typography variant="h4" align="center">{dictionary.auth.login.title}</Typography><br/>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container direction="column">
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
            <br/>
            <Grid item>
              <Controller
                name="password"
                control={control}
                rules={{ required: dictionary.forms.validations.required }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    label={dictionary.forms.fieldPassword}
                    name="password"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
              <br/>
              <Typography align="right">
                <Link component={RouterLink} to={routes.auth.resetPassword} color="primary" variant="body2">{dictionary.auth.login.buttonResetPassword}</Link>
              </Typography>
            </Grid>
            <Grid pt={2} item>
              <LoadingButton fullWidth type="submit" loading={isSubmitting} size="large" variant="contained" color="primary">
                {dictionary.auth.login.buttonLogin}
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box my={2}>
        <Divider orientation="horizontal" flexItem>
          {dictionary.auth.divider}
        </Divider>
      </Box>
      <Stack direction="row" justifyContent="center" spacing={2}>
        {config.featureFlags.googleSSO && (
          <Tooltip title={dictionary.auth.login.buttonLoginWithGoogle}>
            <IconButton onClick={() => onSSOLogin('google')}>
              <img src="/google.svg" alt="Google" width={32} height={32} />
            </IconButton>
          </Tooltip>
        )}
        {config.featureFlags.microsoftSSO && (
          <Tooltip title={dictionary.auth.login.buttonLoginWithMicrosoft}>
            <IconButton onClick={() => onSSOLogin('microsoft')}>
              <img src="/microsoft.svg" alt="Microsoft" width={32} height={32} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <Box mt={4} textAlign="center">
        <Typography variant="body2">
          {dictionary.auth.login.dontHaveAccount}
        </Typography>
        <Box mt={2}>
          <Button component={RouterLink} to={routes.auth.signup} variant="contained" color="secondary" size="large">
            {dictionary.auth.login.buttonCreateAccount}
          </Button>
        </Box>
      </Box>
    </LoggedOutActionsLayout>
  );
};
