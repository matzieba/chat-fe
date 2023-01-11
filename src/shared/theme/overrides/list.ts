import { Theme } from '@mui/material';

const List = (theme: Theme) => {
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          paddingRight: theme.spacing(2),
        },
      },
    },
  };
};

export default List;
