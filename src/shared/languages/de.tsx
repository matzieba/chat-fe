import { warnOnMissingTranslations } from '@cvt/helpers/translation';

import { dictionary as en } from './en';

export const de = {
  
};

warnOnMissingTranslations(de, 'de');

const dictionary = {
  ...en,
  ...de,
};

export default dictionary;
