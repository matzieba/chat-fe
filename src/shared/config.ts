import en from './languages/en';
import de from './languages/de';

const config: CVT.Config = {
  projectName: 'Sidzinski Butler',
  featureFlags: {
    googleSSO: true,
    microsoftSSO: false,
    translations: false,
    notifications: false,
    darkMode: true,
  },
  theme: {
    defaultMode: 'dark',
    drawerWidth: 240,
    disableRipple: true,
    elevation: 0,
  },
  language: {
    dictionaries: {
      en,
      de,
    },
    languageLabelMap: {
      en: 'English',
      de: 'Deutsche',
    },
    supportedLanguages: ['en'],
    defaultLanguage: 'en',
    defaultDictionary: en,
  },
  defaultPermissions: {
    users: {
      list: false,
      view: true,
      create: false,
      edit: false,
      delete: false,
      invite: true,
    },
    companies: {
      list: true,
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    chats: {
      list: true,
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
  },
  dialogs: ['inviteTeamMember'],
};

export default config;
