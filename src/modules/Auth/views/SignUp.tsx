import React, { useCallback, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Divider, IconButton, Tooltip, Typography, Button, Stack } from '@mui/material';

import { routes } from '@shared/routes';
import config from '@shared/config';
import { FeedbackContext, LocalizationContext } from '@cvt/contexts';

import { useSignup } from '../hooks/useSignup';
import { LoggedOutActionsLayout } from '../components/LoggedOutActionsLayout';
import { UserSignupForm } from '../partials/UserSignupForm';

export const SignUp = () => {

  const navigate = useNavigate();
  const { genericErrorFeedback, triggerFeedback } = useContext(FeedbackContext);
  const { dictionary } = useContext(LocalizationContext);


  const { signupAndLogin, signupWithSSO } = useSignup();

  const onSSOLogin = useCallback(async (provider: string) => {
    try {
      await signupWithSSO(provider);
    } catch (e: any) {
      triggerFeedback({
        severity: 'error',
        message: e.message,
      });
    }
  }, [signupWithSSO, triggerFeedback]);

  const onSubmit = useCallback(async (data: Auth.SignupWithEmailAndPassword) => {
    try {
      await signupAndLogin(data);
      navigate(routes.welcome);
    } catch(e) {
      console.error(e);
      genericErrorFeedback();
    }
  }, [genericErrorFeedback, signupAndLogin, navigate]);

  return (
    <LoggedOutActionsLayout>
      <Typography variant="h4" align="center">{dictionary.auth.signUp.title}</Typography>
      <Box pt={2}>
        <UserSignupForm
          onSubmitRequest={onSubmit}
          onSubmitButtonText={dictionary.auth.signUp.buttonSignup}
        />
      </Box>
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
          {dictionary.auth.signUp.alreadyHaveAccount}
        </Typography>
        <Box mt={2}>
          <Button component={RouterLink} to={routes.auth.login} variant="contained" color="secondary" size="large">
            {dictionary.auth.signUp.buttonLogin}
          </Button>
        </Box>
      </Box>
    </LoggedOutActionsLayout>
  );
};
