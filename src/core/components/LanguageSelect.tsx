import React from 'react';
import { MenuItem, TextField } from '@mui/material';

import { getLanguageLabel } from '@cvt/helpers/language';

import config from '@shared/config';

import { LocalizationContext } from '../contexts';


interface Props {
  onChange?: (props: any) => void;
};

export const LanguageSelect: React.FC<Props> = ({ onChange = () => null }) => {
  const { language, setLanguage } = React.useContext(LocalizationContext);

  const changeLanguage = React.useCallback((key: CVT.Language.SupportedLanguages) => {
    setLanguage(key);
    onChange(key);
  }, [onChange, setLanguage]);

  return (
    <TextField
      variant="standard"
      select
      value={language}
    >
      {config.language.supportedLanguages.map(key => (
        <MenuItem key={key} onClick={() => changeLanguage(key)} value={key}>
          {getLanguageLabel(key)}
        </MenuItem>
      ))}
    </TextField>
  );
};
