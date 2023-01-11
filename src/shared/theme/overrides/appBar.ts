import { Theme } from '@mui/material';

const AppBar = (theme: Theme) => {
  return {
    MuiAppBar: {
      styleOverrides: {
        positionFixed: {
          zIndex: theme.zIndex.drawer + 1,
        },
      },
    },
  };
};

export default AppBar;
