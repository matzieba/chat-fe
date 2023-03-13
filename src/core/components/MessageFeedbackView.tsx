import React from 'react';
import { Grid, Typography } from '@mui/material';

import { LocalizationContext } from '@cvt/contexts';

type Props = {
  message?: string;
  height?: string | number;
}
export const MessageFeedbackView: React.FC<Props> = ({ message, height = '100%' }) => {

  const { dictionary } = React.useContext(LocalizationContext);

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height }}>
      <Grid item>
        <Typography component="span" variant="h4" color="textSecondary">
          {message || dictionary.errors.somethingWentWrong}
        </Typography>
      </Grid>
    </Grid>
  );
};
