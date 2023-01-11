import { useCallback, useContext } from 'react';

import { trackLogIn } from '@cvt/tracking';
import { LocalizationContext } from '@cvt/contexts';

import { authClient } from '../client/authClient';
import { AuthContext } from '../contexts/AuthContext';



export const useSignin = () => {

  const { dictionary } = useContext(LocalizationContext);
  const { login: userLogin, ssoLogin, logout } = useContext(AuthContext);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const result = await userLogin(email, password);
      trackLogIn();
      return result;
    } catch (e) {
      return Promise.reject(e);
    }
  }, [userLogin]);

  const signInWithSSO = useCallback(async (provider: string) => {
    const result = await ssoLogin(provider);
    
    if(result.success !== true) {
      return Promise.reject({ type: 'error', message: result.message });
    } else {
      try {
        await authClient.signupWithSSO();
        trackLogIn();
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
    signIn,
    signInWithSSO,
  };
};
