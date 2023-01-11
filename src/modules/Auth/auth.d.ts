declare namespace Auth {
  export interface SignupWithEmailAndPassword {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;
  }

  export type ResetPassword = {
    email: string;
  };

  export type SignupWithEmailAndPasswordApi = CVT.CamelToSnakeCase<SignupWithEmailAndPassword>;
  export type ResetPasswordApi = CVT.CamelToSnakeCase<ResetPassword>;
}

declare namespace Users {
  export interface User {
    id: number;
    firebaseUid: string;
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
  }

  export type UserApi = CVT.CamelToSnakeCase<Omit<User, 'displayName'>>;
}
