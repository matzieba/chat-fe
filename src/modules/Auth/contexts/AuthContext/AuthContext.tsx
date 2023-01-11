import React from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthState } from 'react-firebase-hooks/auth';

import { firebaseClient } from '@cvt/clients/firebaseClient';
import { PermissionContext } from '@cvt/contexts';

import { useMe } from '../../hooks/useMe';
import { cacheKeys } from '../../config';

import { ContextProps } from './types';

export const defaultContext: ContextProps = {
  firebaseUser: undefined,
  user: undefined,
  login: () => {},
  impersonate: () => {},
  resetPassword: () => {},
  ssoLogin: () => {},
  logout: () => {},
  isLoggedIn: false,
  loading: false,
  error: undefined,
};

export const AuthContext = React.createContext(defaultContext);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

  const { resetPermissions } = React.useContext(PermissionContext);

  const [firebaseUser, loading, error] = useAuthState(firebaseClient.getAuth());

  const queryClient = useQueryClient();

  const { user } = useMe({
    enabled: !!firebaseUser && !firebaseUser.isAnonymous,
  });

  const isLoggedIn = React.useMemo(() => !!firebaseUser, [firebaseUser]);

  const isPWA = React.useMemo(() => {
    return window.hasOwnProperty('matchMedia') && window?.matchMedia('(display-mode: standalone)').matches;
  }, []);

  const ssoLogin = React.useCallback(async (provider: string) => {
    try {
      let ssoProvider: any = new firebaseClient.auth.GoogleAuthProvider();
      if(provider === 'twitter') {
        ssoProvider = new firebaseClient.auth.TwitterAuthProvider();
      }
      if(provider === 'microsoft') {
        ssoProvider = new firebaseClient.auth.OAuthProvider('microsoft.com');
      }
      if(provider === 'facebook') {
        ssoProvider = new firebaseClient.auth.FacebookAuthProvider();
      }
      if(provider === 'google') {
        ssoProvider.addScope('email');
        ssoProvider.addScope('profile');
        ssoProvider.setCustomParameters({ prompt: 'select_account' });
      }
      try {
        if(isPWA) {
          firebaseClient.auth.signInWithRedirect(ssoProvider);
          return Promise.resolve({
            success: true,
          });
        } else {
          const response = await firebaseClient.auth.signInWithPopup(ssoProvider);
          if (response.user) {
            return Promise.resolve({
              success: true,
            });
          } else {
            return Promise.reject({
              success: false,
              message: 'Wrong Email',
            });
          }
        }
      } catch(error: any) {
        return Promise.reject({
          success: false,
          error: error.code,
          message: error.message,
        });
      }
    } catch(error: any) {
      return Promise.reject({
        success: false,
        error: error.code,
        message: error.message,
      });
    }
  }, [isPWA]);

  const login = React.useCallback(async (email: string, password: string) => {
    try {
      const response = await firebaseClient.auth.signInWithEmailAndPassword(email, password);
      return Promise.resolve({
        success: !!response,
      });
    } catch (error: any) {
      return Promise.reject({
        success: false,
        error: error.code,
        message: error.message,
      });
    }
  }, []);

  const resetPassword = React.useCallback(async (email: string) => {
    try {
      await firebaseClient.auth.sendPasswordResetEmail(email);
      return Promise.resolve({
        success: true,
      });
    } catch (error: any) {
      return Promise.reject({
        success: false,
        error: error.code,
        message: error.message,
      });
    }
  }, []);

  const impersonate = React.useCallback(async (token: string) => {
    try {
      queryClient.clear();
      const response = await firebaseClient.auth.signInWithCustomToken(token);
      return Promise.resolve({
        success: !!response,
      });
    } catch (error: any) {
      return Promise.reject({
        success: false,
        error: error.code,
        message: error.message,
      });
    }
  }, [queryClient]);

  const logout = React.useCallback(async () => {
    await firebaseClient.auth.signOut();
    resetPermissions();
    queryClient.removeQueries([cacheKeys.getMe]);
    queryClient.clear();
  }, [queryClient, resetPermissions]);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        logout,
        login,
        ssoLogin,
        resetPassword,
        impersonate,
        isLoggedIn,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;
