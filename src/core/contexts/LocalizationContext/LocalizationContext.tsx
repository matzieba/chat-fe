import React from 'react';

import config from '@shared/config';

import { ContextProps } from './LocalizationContext.types';

const localStorageKey = `${import.meta.env.VITE__CVT_PROJECT_KEY}-language`;

const defaultContext: ContextProps = {
  language: config.language.defaultLanguage,
  dictionary: config.language.defaultDictionary,
  setLanguage: () => null,
};


const getLanguageFromLocalStorage = (): CVT.Language.SupportedLanguages => {
  const lang = localStorage.getItem(localStorageKey) as CVT.Language.SupportedLanguages || defaultContext.language;
  if(config.language.supportedLanguages.includes(lang)) {
    return lang;
  }
  return config.language.defaultLanguage;
};


export const LocalizationContext = React.createContext(defaultContext);

export const LocalizationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

  const [language, setLanguage] = React.useState<CVT.Language.SupportedLanguages>(getLanguageFromLocalStorage());
  const dictionary = config.language.dictionaries[language];


  React.useEffect(() => {
    localStorage.setItem(localStorageKey,language);
  },[language]);

  return (
    <LocalizationContext.Provider
      value={{
        dictionary,
        language,
        setLanguage,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const LocalizationConsumer = LocalizationContext.Consumer;
