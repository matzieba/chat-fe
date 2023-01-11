import { Theme } from '@mui/material';

const TextField = (theme: Theme) => {
  return {
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
  };
};

export default TextField;
