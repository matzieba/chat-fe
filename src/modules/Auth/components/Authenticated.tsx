import React from 'react';

import { AuthContext } from '@modules/Auth/contexts/AuthContext';

export const Authenticated: React.FC<React.PropsWithChildren> = ({ children }) => {

  const { isLoggedIn } = React.useContext(AuthContext);

  if (isLoggedIn) {
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }

  return null;
};

export const NotAuthenticated: React.FC<React.PropsWithChildren> = ({ children }) => {

  const { isLoggedIn } = React.useContext(AuthContext);

  if (!isLoggedIn) {
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }

  return null;
};
