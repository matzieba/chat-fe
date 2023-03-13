declare namespace CVT {
  export namespace Permission {
    export interface Permissions {
      users: CVT.Permission.CrudPermission & {
        invite: boolean;
      };
    };
  };
};


declare namespace Auth {
  export interface SignupWithEmailAndPassword {
    phone?: CVT.MaybeNull<string>;
    userInvitationId?: CVT.MaybeNull<string>;
  }

  export type UserInvite = {
    id?: string;
    email?: string;
  }

  export type UserInviteApi = CVT.CamelToSnakeCase<UserInvite>;
}

declare namespace Users {

  export type Type = 'customer' | 'admin';

  export interface User {
    type: Type;
    phone?: CVT.MaybeNull<string>;
    profilePicture?: string;
  }

  // TODO: Implement in Company module
  // jobTitle: CVT.MaybeNull<string>;

  // export interface ExtendedUser extends User {
  //   company: MaybeNull<Companies.Company>;
  // }

  export interface Crud {
    firstName: string;
    lastName: string;
    email: string;
    phone?: CVT.MaybeNull<string>;
    type?: Type;
    profilePicture?: File | string;
  }

  export interface Create extends Crud {}

  export interface Edit extends Crud {
    id: number;
  }

  export interface ListParams {
    type: string;
    search: string;
  }

  export type GetListParams = CVT.Query.GetListParams<ListParams>;

  export type CrudApi = CVT.CamelToSnakeCase<Crud>;
}
