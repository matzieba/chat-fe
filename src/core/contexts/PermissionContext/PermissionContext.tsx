import React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

import config from '@shared/config';

import { ContextProps } from './PermissionContext.types';

Object.freeze(config.defaultPermissions);

export const defaultContext: ContextProps = {
  permissions: cloneDeep(config.defaultPermissions),
  getPermission: () => false,
  updatePermissions: () => {},
  setPermissions: () => {},
  resetPermissions: () => {},
};

export const PermissionContext = React.createContext(defaultContext);

export const PermissionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

  const [permissions, setStatePermissions] = React.useState<CVT.Permission.Permissions>(cloneDeep(config.defaultPermissions));

  const getPermission = React.useCallback((permissionKey: CVT.Permission.PermissionKey) => {
    return get(permissions, permissionKey);
  }, [permissions]);

  const setPermissions = React.useCallback((updatedPermissions: Partial<CVT.Permission.Permissions>) => {
    setStatePermissions(permissions => cloneDeep(merge(permissions, updatedPermissions)));
  }, []);

  const updatePermissions = React.useCallback((permissionKeys: CVT.Permission.PermissionKey[], value: boolean) => {
    const updatedPermissions = {};
    permissionKeys.forEach(key => set(updatedPermissions, key, value));
    setStatePermissions(permissions => cloneDeep(merge(permissions, updatedPermissions)));
  }, []);

  const resetPermissions = React.useCallback(() => {
    setStatePermissions(cloneDeep(config.defaultPermissions));
  }, []);


  return (
    <PermissionContext.Provider
      value={{
        permissions,
        getPermission,
        setPermissions,
        updatePermissions,
        resetPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const PermissionConsumer = PermissionContext.Consumer;
