export type ContextProps = {
  permissions: CVT.Permission.Permissions;
  getPermission: (permission: CVT.Permission.PermissionKey) => boolean;
  setPermissions: (permissions: Partial<CVT.Permission.Permissions>) => void;
  updatePermissions: (permissions: CVT.Permission.PermissionKey[], value: boolean) => void;
  resetPermissions: () => void;
};
