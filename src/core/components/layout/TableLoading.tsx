import React, { FC, Fragment } from 'react';
import { TableRow, TableCell, Skeleton } from '@mui/material';

type Props = {
  repeat?: number;
  columns?: number;
  minColWidth?: number;
  renderRow?: (rows: React.ReactNode) => React.ReactNode;
}

export const TableLoading: FC<Props> = ({ repeat = 10, columns = 3, minColWidth, renderRow }) => {

  const cells = React.useMemo(() => {
    return [...Array(columns)].map((it, c) => (
      <TableCell key={c} align={c === (columns - 1) ? 'right' : 'left'}>
        <Skeleton variant="text" width="50%" style={{ display: 'inline-block', minWidth: minColWidth }} />
      </TableCell>
    ));
  }, [columns, minColWidth]); 

  return (
    <Fragment>
      {[...Array(repeat)].map((it, i) => (
        <React.Fragment>
          {renderRow ? renderRow(cells) : (
            <TableRow key={i}>
              {cells}
            </TableRow>
          )}
        </React.Fragment>
      ))}
    </Fragment>
  );
};
