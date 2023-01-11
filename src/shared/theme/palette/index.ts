import { PaletteMode } from '@mui/material';
import { grey as MuiGrey } from '@mui/material/colors';

const grey = {
  ...MuiGrey,
  100: '#F6F6F6',
  // 900: '#121212',
};

const palette = (mode: PaletteMode) => {
  return {
    mode,
    grey,
    background: {
      default: mode === 'light' ? grey['100'] : grey['900'],
    },
  };
};

export default palette;
