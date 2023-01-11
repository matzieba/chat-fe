import { Theme } from '@mui/material';
import config from '@shared/config';

const Button = (theme: Theme) => {
  return {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: config.theme.disableRipple,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: config.theme.elevation === 0,
      },
    },
  };
};

export default Button;
