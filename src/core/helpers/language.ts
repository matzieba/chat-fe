import config from '@shared/config';

export const getLanguageLabel = (language: CVT.Language.SupportedLanguages): string => {
  return config.language.languageLabelMap[language];
};
