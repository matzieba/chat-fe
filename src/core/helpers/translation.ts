import { Dictionary } from '@shared/dictionary';
import { dictionary as en } from '@shared/languages/en';

export const warnOnMissingTranslations = (dictionary: Partial<Dictionary>, language: string) => {
  let key: keyof Dictionary | keyof typeof dictionary;
  for (key in en) {
    if(!dictionary.hasOwnProperty(key)) {
      console.warn(`${key} is not translated in ${language}. Will default to English.`);
    }
  }
};
