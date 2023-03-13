import en from './languages/en';
import de from './languages/de';

const config: CVT.Config = {
  projectName: 'Cookie Cutter',
  featureFlags: {
    googleSSO: true,
    microsoftSSO: true,
    translations: true,
    notifications: true,
    darkMode: true,
  },
  theme: {
    defaultMode: 'light',
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
    supportedLanguages: ['en', 'de'],
    defaultLanguage: 'en',
    defaultDictionary: en,
  },
  defaultPermissions: {
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      invite: true,
    },
  },
  dialogs: ['inviteTeamMember'],
};

export default config;
