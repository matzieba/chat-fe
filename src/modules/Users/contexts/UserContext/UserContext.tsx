import React from 'react';

import { AuthContext } from '@modules/Auth/contexts';

import { UserType } from '../../enums';

import { ContextProps } from './types';

export const defaultContext: ContextProps = {
  user: undefined,
  isAdmin: false,
  isStaff: false,
  isCustomer: false,
};

export const UserContext = React.createContext(defaultContext);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

  const { user } = React.useContext(AuthContext);

  const isAdmin = React.useMemo(() => user?.type === UserType.Admin, [user]);
  const isStaff = React.useMemo(() => user?.type === UserType.Staff, [user]);
  const isCustomer = React.useMemo(() => user?.type === UserType.Customer, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        isAdmin,
        isStaff,
        isCustomer,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;
 