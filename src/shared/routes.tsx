import { Add, Dashboard, ExitToApp, LockOpen, People, Person } from '@mui/icons-material';

import { Dictionary } from '@shared/dictionary';

export const routes = {
  home: '/',
  welcome: '/welcome',
  auth: {
    impersonateUser: '/auth/impersonate',
    login: '/auth/login',
    resetPassword: '/auth/reset-password',
    resetPasswordConfirm: '/auth/reset-password-confirm',
    signup: '/auth/signup',
  },
  user: {
    myAccount: '/my-account',
    invite: (token: string = ':token') => `/invitation/${token}`,
    list: '/users',
    team: '/team',
    create: '/users/create',
    edit: (userId: string | number = ':userId') => `/users/edit/${userId}`,
  },
};

export const navigation = (dictionary: Dictionary): CVT.Navigation.Config => ({
  userMenu: [{
    icon: <Person />,
    text: dictionary.menu.user.myAccount,
    route: routes.user.myAccount,
    requiresAuth: true,
  }, {
    icon: <LockOpen />,
    text: dictionary.menu.auth.login,
    route: routes.auth.login,
    requiresAuth: false,
  }, {
    icon: <ExitToApp />,
    text: dictionary.menu.auth.signUp,
    route: routes.auth.signup,
    requiresAuth: false,
  }],
  sidebar: [{
    icon: <Dashboard />,
    text: dictionary.menu.dashboard,
    route: routes.home,
  }, {
    divider: true,
  }, {
    icon: <People />,
    text: dictionary.menu.user.team,
    route: routes.user.team,
    permission: 'users.view',
    children: [{
      icon: <Add />,
      text: dictionary.menu.user.create,
      route: routes.user.create,
      permission: 'users.create',
    }],
  }],
});
