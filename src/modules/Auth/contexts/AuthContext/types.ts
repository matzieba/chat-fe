export type ContextProps = {
  firebaseUser: CVT.Maybe<any>;
  user: CVT.Maybe<Users.User>;
  logout: () => void;
  login: (email: string, password: string) => any;
  ssoLogin: (provider: string) => any;
  resetPassword: (email: string) => any;
  impersonate: (token: string) => any;
  isLoggedIn: boolean;
  loading: boolean;
  error: CVT.Maybe<any>;
};
