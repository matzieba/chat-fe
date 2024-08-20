import { PaletteMode, lighten } from '@mui/material';
import { grey as MuiGrey } from '@mui/material/colors';

const grey = {
  ...MuiGrey,
  100: '#F6F6F6',
  // 900: '#121212',
};

declare module '@mui/material/styles' {
  interface Palette {
    inverse: Palette['primary'];
  }

  interface PaletteOptions {
    inverse?: PaletteOptions['primary'];
  }
}

const dark = '#111';
const light = '#FFF';

const primary = '#7125d0';

const palette = (mode: PaletteMode) => {
  const secondary = mode === 'light' ? light : dark;
  const inverse = mode === 'light' ? dark : light;
  return {
    mode,
    grey,
    background: {
      default: mode === 'light' ? grey['100'] : '#222',
      paper: mode === 'light' ? '#FFFFFF' : '#111',
    },
    primary: {
      main: primary,
      light: lighten(primary, 0.9),
      contrastText: light,
    },
    secondary: {
      main: secondary,
      light: secondary,
      contrastText: inverse,
    },
    inverse: {
      main: inverse,
      light: inverse,
      contrastText: secondary,
    },
  };
};

export default palette;
