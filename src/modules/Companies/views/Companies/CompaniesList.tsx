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

import { useCompanies } from '@modules/Companies/hooks/useCompanies';

import { Filters } from './partials/CompaniesHeader';
import { CompanyRow } from './components/CompanyRow';

interface Props {
  filters: Filters;
}

export const CompaniesList: React.FC<Props> = ({ filters }) => {

  const { dictionary } = React.useContext(LocalizationContext);

  const { companies, status } = useCompanies({
    ...filters,
  });

  if (status === 'loading' || !companies) {
    return <BodyLoading height="100vh"/>;
  }

  return (
    <TableContainer sx={{ overflowX: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'visible' } }}>
      <Table
        aria-label="companies table"
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
            <TableCell>{dictionary.companies.list.nameLabel}</TableCell>
            <TableCell align="right"/>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map(company => (
            <CompanyRow
              key={company.id}
              {...company}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
