import React from 'react';

import { PermissionContext } from '@cvt/contexts';

import { AuthContext } from '@modules/Auth/contexts';

import { UserType } from '../../enums';

import { ContextProps } from './types';

export const defaultContext: ContextProps = {
  user: undefined,
  isAdmin: false,
  isCustomer: false,
};

const adminPermissionList: CVT.Permission.PermissionKey[] = ['users.view', 'users.create', 'users.edit', 'users.delete'];

export const UserContext = React.createContext(defaultContext);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

  const { user } = React.useContext(AuthContext);
  const { updatePermissions } = React.useContext(PermissionContext);

  const isAdmin = React.useMemo(() => user?.type === UserType.Admin, [user]);
  const isCustomer = React.useMemo(() => user?.type === UserType.Customer, [user]);

  React.useEffect(() => {
    updatePermissions(adminPermissionList, isAdmin);
  }, [updatePermissions, isAdmin]);

  return (
    <UserContext.Provider
      value={{
        user,
        isAdmin,
        isCustomer,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;
 