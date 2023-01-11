import React from 'react';

import { Dictionary } from '@shared/dictionary';
import config from '@shared/config';

import { ContextProps } from './LocalizationContext.types';

const localStorageKey = `${process.env.REACT_APP_CVT_PROJECT_KEY}-language`;

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

type Props = React.PropsWithChildren<{
  dictionaries: Record<CVT.Language.SupportedLanguages, Dictionary>;
}>

export const LocalizationProvider: React.FC<Props> = ({ children, dictionaries }) => {

  const [language, setLanguage] = React.useState<CVT.Language.SupportedLanguages>(getLanguageFromLocalStorage());
  const dictionary = dictionaries[language];


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
