import React from 'react';

import { AuthContext } from '@modules/Auth/contexts';
import { UserContext } from '@modules/Users/contexts';


import { ContextProps } from './types';

export const defaultContext: ContextProps = {
  company: undefined,
  selectCompany: () => {},
};


export const CompanyContext = React.createContext(defaultContext);

export const CompanyProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

  const { isLoggedIn } = React.useContext(AuthContext);
  const { user, isAdmin } = React.useContext(UserContext);
  const [company, setCompany] = React.useState(user?.company);

  React.useEffect(() => {
    if (isLoggedIn && !isAdmin && user?.company) {
      setCompany(user?.company);
    } else {
      setCompany(undefined);
    }
  }, [isLoggedIn, isAdmin, user, setCompany]);
  
  return (
    <CompanyContext.Provider
      value={{
        company: company || undefined,
        selectCompany: setCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const CompanyConsumer = CompanyContext.Consumer;
