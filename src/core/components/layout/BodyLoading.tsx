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
      <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ height }}
      >
        <div className={`loader chess-figure ${theme.palette.mode}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 58">
            <path d="
            M29 6a3 3 0 00-2.93 2.36A3.12 3.12 0 0023 11a3 3 0 103 3 3 3 0 006 0 3 3 0 10-3-3 3.12 3.12 0 00-3.07-2.64A3 3 0 1029 6zm0 18a7 7 0 01-7-7 9 9 0 00-18 0 25 25 0 007.45 18H27v19h4V35h7.55A25 25 0 0036 17a7 7 0 01-7-7z"
            ></path>
          </svg>
        </div>
      </Grid>
  );
};
