import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { LocalizationContext } from '@cvt/contexts';
import { BodyLoading } from '@cvt/components/layout/BodyLoading';

import { useUsers } from '@modules/Users/hooks/useUsers';

import { Filters } from './partials/TeamHeader';
import { UserRow } from './components/UserRow/UserRow';

interface Props {
    filters: Filters;
}

export const TeamList: React.FC<Props> = ({ filters }) => {

  const { dictionary } = React.useContext(LocalizationContext);
  // const { company } = React.useContext(CompanyContext);

  const { users, status } = useUsers({
    // company: company?.id,
    ...filters,
  });

  if (status === 'loading' || !users) {
    return <BodyLoading height="100vh"/>;
  }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="team table">
        <TableHead color="primary">
          <TableRow>
            <TableCell>{dictionary.users.team.detailsLabel}</TableCell>
            <TableCell align="right"/>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <UserRow
              key={user.id}
              {...user}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
