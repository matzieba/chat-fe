import { Dictionary } from "@shared/dictionary";

export type ContextProps = {
  language: CVT.Language.SupportedLanguages;
  setLanguage: (lang: CVT.Language.SupportedLanguages) => void;
  dictionary: Dictionary;
};


