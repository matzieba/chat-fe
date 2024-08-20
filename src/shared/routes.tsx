import { Add, Business, Dashboard, ExitToApp, LockOpen, People, Person } from '@mui/icons-material';

import { Dictionary } from '@shared/dictionary';

export const routes = {
  home: '/',
  chat: '/chat',
  welcome: '/welcome',
  auth: {
    impersonateUser: '/auth/impersonate',
    login: '/auth/login',
    resetPassword: '/auth/reset-password',
    resetPasswordConfirm: '/auth/reset-password-confirm',
    signup: '/auth/signup',
  },
  users: {
    myAccount: '/my-account',
    invite: (token: string = ':token') => `/invitation/${token}`,
    list: '/users',
    team: '/team',
    create: '/users/create',
    edit: (userId: string | number = ':userId') => `/users/edit/${userId}`,
  },
  companies: {
    list: '/companies',
    create: '/companies/create',
    edit: (companyId: string | number = ':companyId') => `/companies/edit/${companyId}`,
  },
};

export const navigation = (dictionary: Dictionary): CVT.Navigation.Config => ({
  userMenu: [{
    icon: <Person />,
    text: dictionary.menu.users.myAccount,
    route: routes.users.myAccount,
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
    text: dictionary.menu.users.team,
    route: routes.users.list,
    requiresAuth: true,
    permission: 'users.view',
    children: [{
      icon: <Add />,
      text: dictionary.menu.users.create,
      route: routes.users.create,
      permission: 'users.create',
    }],
  }, {
    icon: <Business />,
    text: dictionary.menu.companies.list,
    route: routes.companies.list,
    requiresAuth: true,
    permission: 'companies.view',
    children: [{
      icon: <Add />,
      text: dictionary.menu.companies.create,
      route: routes.companies.create,
      permission: 'companies.create',
    }],
  }],
});
