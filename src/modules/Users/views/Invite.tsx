import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import config from '@shared/config';
import { routes } from '@shared/routes';
import { FeedbackContext, LocalizationContext } from '@cvt/contexts';

import { useSignup } from '@modules/Auth/hooks/useSignup';
import { LoggedOutActionsLayout } from '@modules/Auth/components/LoggedOutActionsLayout';
import { UserSignupForm } from '@modules/Auth/partials/UserSignupForm';

import { useInvitation } from '../hooks/useInvitation';

export const Invite: React.FC = () => {

  const { token } = useParams();
  const navigate = useNavigate();
  const { genericErrorFeedback, triggerFeedback } = React.useContext(FeedbackContext);
  const { dictionary } = React.useContext(LocalizationContext);

  const { status, invite } = useInvitation({ id: token || '' }, {
    enabled: !!token,
  });

  const { signupAndLogin, signupWithSSO } = useSignup();

  const onSSOLogin = React.useCallback(async (provider: string) => {
    try {
      await signupWithSSO(provider);
    } catch (e: any) {
      triggerFeedback({
        severity: 'error',
        message: e.message,
      });
    }
  }, [signupWithSSO, triggerFeedback]);

  const onSubmit = React.useCallback(async (data: Auth.SignupWithEmailAndPassword) => {
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
      <Typography variant="h4" align="center">{dictionary.users.invite.title}</Typography>
      {/* TODO: Implement Company */}
      {/* <Typography variant="body2" align="center">{dictionary.users.invite.subtitle(invite?.company?.name)}</Typography> */}
      <Box pt={2}>
        {status === 'success' && (
          <UserSignupForm
            // hiddenFields={['company']}
            disabledFields={['email']}
            defaultValues={{ userInvitationId: token, email: invite?.email }}
            onSubmitRequest={onSubmit}
            onSubmitButtonText={dictionary.users.invite.buttonAcceptInvitation}
          />
        )}
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
    </LoggedOutActionsLayout>
  );
};
