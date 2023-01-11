import { Theme } from '@mui/material';

import config from '../../config';

const Paper = (theme: Theme) => {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: config.theme.elevation,
      },
    },
  };
};

export default Paper;
