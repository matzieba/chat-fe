import React from 'react';

import { LocalizationContext } from '@cvt/contexts';

export const useDictionary = () => {
  const { dictionary } = React.useContext(LocalizationContext);
  return dictionary;
};
