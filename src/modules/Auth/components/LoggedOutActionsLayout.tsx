import React from 'react';
import { Box, Grid } from '@mui/material';

export const LoggedOutActionsLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Grid
    container
    justifyContent="center"
    alignItems="center"
  >
    <Grid
      item
      sx={theme => ({
        minWidth: 350,
        [theme.breakpoints.down('sm')]: {
          minWidth: '100%',
        },
      })}
    >
      <Box p={4}>
        {children}
      </Box>
    </Grid>
  </Grid>
);
