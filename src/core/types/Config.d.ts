declare namespace CVT {
  export interface Config {
    projectName: string;
    featureFlags: React<string, boolean>;
    theme: {
      defaultMode: PaletteMode;
      drawerWidth: number;
      disableRipple: boolean;
      elevation: number;
    },
    language: {
      dictionaries: Record<CVT.Language.SupportedLanguages, any>;
      languageLabelMap: Record<CVT.Language.SupportedLanguages, string>
      supportedLanguages: CVT.Language.SupportedLanguages[];
      defaultLanguage: CVT.Language.SupportedLanguages;
      defaultDictionary: any;
    },
    defaultPermissions: CVT.Permission.Permissions;
    dialogs: string[];
  }
};
