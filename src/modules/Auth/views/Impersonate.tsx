import React from 'react';
import { useNavigate } from 'react-router';

import { useQueryState } from '@cvt/hooks/useQueryState';
import { BodyLoading } from '@cvt/components/layout/BodyLoading';

import { routes } from '@shared/routes';

import { FeedbackContext, LocalizationContext } from '@cvt/contexts';

import { AuthContext } from '../contexts/AuthContext';

export const Impersonate: React.FC = () => {

  const { dictionary } = React.useContext(LocalizationContext);
  const { triggerFeedback } = React.useContext(FeedbackContext);
  const { impersonate } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [token] = useQueryState('token');

  const impersonateUser = React.useCallback(async (token: string) => {
    try {
      await impersonate(token);
      navigate(routes.home);
    } catch {
      triggerFeedback({
        severity: 'error',
        message: dictionary.auth.impersonate.invalidToken,
      });
      navigate(routes.auth.login);
    }
  }, [impersonate, navigate, triggerFeedback, dictionary]);

  React.useEffect(() => {
    if (token) {
      impersonateUser(token);
    } else {
      triggerFeedback({
        severity: 'error',
        message: dictionary.auth.impersonate.noToken,
      });
      navigate(routes.auth.login);
    }
  }, [impersonateUser, navigate, token, triggerFeedback, dictionary]);

  return <BodyLoading height="100vh"/>;
};
