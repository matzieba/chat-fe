import React, { FC } from 'react';
// TODO: Remove react-spinners
import { BounceLoader } from 'react-spinners';
import { Grid, useTheme } from '@mui/material';

type Props = {
  size?: number;
  height?: number | string;
}

export const BodyLoading: FC<Props> = ({ size = 100, height = 'calc(100vh - 150px)' }) => {

  const theme = useTheme();

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" style={{ height }}>
      <BounceLoader color={theme.palette.primary.main} size={size}/>
    </Grid>
  );
};
