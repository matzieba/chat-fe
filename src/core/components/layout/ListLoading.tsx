import React, { FC } from 'react';
import { Grid, GridProps } from '@mui/material';

type Props = Pick<GridProps, 'xs' | 'sm' | 'md' | 'lg'> & {
  height?: string | number;
  repeat?: number;
  spacing?: number;
  renderItem: (i: number) => React.ReactNode;
}
export const ListLoading: FC<Props> = ({ height = 'auto', spacing = 2, repeat = 6, xs = 12, renderItem, ...props }) => (
  <Grid container spacing={spacing}>
    {[...Array(repeat)].map((it, i) => (
      <Grid key={i} item xs={xs} {...props}>
        {renderItem(i)}
      </Grid>
    ))}
  </Grid>
);
