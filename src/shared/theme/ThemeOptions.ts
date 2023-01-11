import { ThemeOptions } from '@mui/material';

import palette from './palette';
import spacing from './spacing';
import breakpoints from './breakpoints';

const themeOptions = (settings: CVT.Theme.Settings): ThemeOptions => {
  const { mode } = settings;

  return {
    palette: palette(mode),
    typography: {
      fontFamily: [
        'Arial',
        'sans-serif',
      ].join(','),
    },
    ...spacing,
    breakpoints,
    shape: {
      borderRadius: 0,
    },
  };
};

export default themeOptions;
