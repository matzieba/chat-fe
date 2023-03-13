import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { LocalizationContext } from '@cvt/contexts';
import { BodyLoading } from '@cvt/components/layout/BodyLoading';

import { useUsers } from '@modules/Users/hooks/useUsers';

import { Filters } from './partials/UsersHeader';
import { UserRow } from './components/UserRow/UserRow';

interface Props {
    filters: Filters;
}

export const UsersList: React.FC<Props> = ({ filters }) => {

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
    <TableContainer sx={{ overflowX: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'visible' } }}>
      <Table
        aria-label="users table"
        sx={{
          borderCollapse: 'separate',
          borderSpacing: theme => `0 ${theme.spacing(1)}`,
          [`& .${tableCellClasses.root}`]: {
            borderBottom: 'none',
          },
        }}
      >
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
