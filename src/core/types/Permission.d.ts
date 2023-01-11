declare namespace CVT {
  export namespace Permission {
    export type CrudPermission = {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    
    export interface Permissions {
    };
  
    export type PermissionKey = CVT.Leaves<Permissions>;
  }
};
