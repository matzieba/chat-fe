import { PaletteMode } from '@mui/material';

export type ContextProps = {
  drawerWidth: number;
  mode: PaletteMode;
  setMode: (mode: PaletteMode) => void;
  toggleMode: () => void;
};
