declare namespace CVT {
  export namespace Permission {
    export interface Permissions {
      companies: CVT.Permission.CrudPermission;
    };
  };
};

declare namespace Auth {
  export interface SignupWithEmailAndPassword {
    jobTitle: CVT.Maybe<string>;
  }
}

declare namespace Users {
  export interface User {
    jobTitle: CVT.MaybeNull<string>;
    company: CVT.MaybeNull<Companies.Company>;
  }

  export interface Crud {
    jobTitle: CVT.MaybeNull<string>;
    company: CVT.MaybeNull<Companies.Company>;
  }

  export interface ListParams {
    company: number;
  }
}

declare namespace Companies {
  export interface Company {
    id: number;
    name: string;
    primaryContact?: number;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Crud extends Omit<Company, 'id' | 'createdAt' | 'updatedAt'> {}

  export interface Create extends Crud {}

  export interface Edit extends Crud {
    id: number;
  }

  export interface ListParams {
    search: string;
  }

  export type GetListParams = CVT.Query.GetListParams<ListParams>;

  export type CrudApi = CVT.CamelToSnakeCase<Crud>;

  export type CompanyApi = CVT.CamelToSnakeCase<Company>;
};
