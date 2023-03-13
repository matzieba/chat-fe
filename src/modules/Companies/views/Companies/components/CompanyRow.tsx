import React from 'react';
import { useNavigate } from 'react-router';
import {
  TableRow,
  TableCell,
  Typography,
  MenuList,
  MenuItem,
  Paper,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';

import { DialogContext, LocalizationContext, PermissionContext } from '@cvt/contexts';
import { IconButtonDropdown } from '@cvt/components/ButtonDropdown';

import { routes } from '@shared/routes';

import { useCompanyCrud } from '../../../hooks/useCompanyCrud';


export const CompanyRow: React.FC<Companies.Company> = (company) => {

  const navigate = useNavigate();

  const { dictionary } = React.useContext(LocalizationContext);
  const { asyncConfirmation } = React.useContext(DialogContext);
  const { permissions } = React.useContext(PermissionContext);

  const { deleteCompany } = useCompanyCrud();

  const onDelete = React.useCallback(async () => {
    const userConfirmed = await asyncConfirmation({ title: dictionary.users.edit.deleteConfirmation });
    if (!deleteCompany || !userConfirmed) {
      return false;
    }
    return deleteCompany(company.id);
  }, [company, deleteCompany, asyncConfirmation, dictionary]);

  return (
    <TableRow component={Paper} elevation={1}> 
      <TableCell component="th" scope="row">
        <Typography variant="subtitle1">{company.name}</Typography>
        <Typography variant="subtitle2">{company.createdAt.toISOString()}</Typography>
      </TableCell>
      <TableCell align="right">
        <IconButtonDropdown
          placement="bottom-start"
          buttonProps={{
            color: 'secondary',
          }}
          content={({ closeDropdown }) => (
            <MenuList>
              {permissions.companies.edit && (
                <MenuItem
                  onClick={() => {
                    navigate(routes.companies.edit(company.id));
                    closeDropdown();
                  }}
                >
                  {dictionary.users.edit.buttonEdit}
                </MenuItem>
              )}
              {permissions.companies.delete && (
                <MenuItem
                  onClick={() => {
                    onDelete();
                    closeDropdown();
                  }}
                >
                  {dictionary.companies.edit.buttonDelete}
                </MenuItem>
              )}
            </MenuList>
          )}
        >
          <MoreVert/>
        </IconButtonDropdown>
      </TableCell>
    </TableRow>
  );
};
