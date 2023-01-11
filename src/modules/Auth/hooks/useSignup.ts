import { useCallback, useContext } from 'react';

import { trackSignUp } from '@cvt/tracking';
import { FeedbackContext, LocalizationContext } from '@cvt/contexts';

import { authClient } from '../client/authClient';
import { AuthContext } from '../contexts/AuthContext';


export const useSignup = () => {

  const { login, ssoLogin, logout } = useContext(AuthContext);
  const { genericErrorFeedback } = useContext(FeedbackContext);
  const { dictionary } = useContext(LocalizationContext);

  const signupAndLogin = useCallback(async (formData: Auth.SignupWithEmailAndPassword) => {
    try {
      await authClient.signupWithEmailAndPassword(formData);
      trackSignUp();
      await login(formData?.email, formData?.password);
    } catch (e) {
      genericErrorFeedback();
      return Promise.reject();
    }
  }, [login, genericErrorFeedback]);

  const signupWithSSO = useCallback(async (provider: string, invitationToken?: string) => {
    const result = await ssoLogin(provider);
    if(result.success !== true) {
      logout();
      return Promise.reject({ type: 'error', message: result.message });
    } else {
      try {
        await authClient.signupWithSSO(invitationToken);
        trackSignUp();
      } catch (e: any) {
        logout();
        if (e.response?.status === 400) {
          return Promise.reject({ type: 'error', message: dictionary.auth.validations.userWithThisEmailAlreadyExists });
        } else {
          return Promise.reject({ type: 'error', message: dictionary.errors.somethingWentWrong });
        }
      }
    }
  }, [ssoLogin, logout, dictionary]);

  return {
    signupAndLogin,
    signupWithSSO,
  };
};
