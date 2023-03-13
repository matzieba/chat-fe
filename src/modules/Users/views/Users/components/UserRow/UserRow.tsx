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
import { IconButtonDropdown } from '@cvt/components/ButtonDropdown'
;
import { useUserCrud } from '@modules/Users/hooks/useUserCrud';
import { routes } from '@shared/routes';


export const UserRow: React.FC<Users.User> = (user) => {

  const navigate = useNavigate();

  const { dictionary } = React.useContext(LocalizationContext);
  const { asyncConfirmation } = React.useContext(DialogContext);
  const { permissions } = React.useContext(PermissionContext);

  const { deleteUser } = useUserCrud();

  const onDelete = React.useCallback(async () => {
    const userConfirmed = await asyncConfirmation({ title: dictionary.users.edit.deleteConfirmation });
    if (!user || !userConfirmed) {
      return false;
    }
    return deleteUser(user.id);
  }, [user, deleteUser, asyncConfirmation, dictionary]);

  return (
    <TableRow component={Paper} elevation={1}> 
      <TableCell component="th" scope="row">
        <Typography variant="subtitle1">{user.displayName}</Typography>
        <Typography variant="subtitle2">{user.email}</Typography>
      </TableCell>
      <TableCell align="right">
        {(permissions.users.edit || permissions.users.delete) && (
          <IconButtonDropdown
            placement="bottom-start"
            buttonProps={{
              color: 'secondary',
            }}
            content={({ closeDropdown }) => (
              <MenuList>
                {permissions.users.edit && (
                  <MenuItem
                    onClick={() => {
                      navigate(routes.users.edit(user.id));
                      closeDropdown();
                    }}
                  >
                    {dictionary.users.edit.buttonEdit}
                  </MenuItem>
                )}
                {permissions.users.delete && (
                  <MenuItem
                    onClick={() => {
                      onDelete();
                      closeDropdown();
                    }}
                  >
                    {dictionary.users.edit.buttonDelete}
                  </MenuItem>
                )}
              </MenuList>
            )}
          >
            <MoreVert/>
          </IconButtonDropdown>
        )}
      </TableCell>
    </TableRow>
  );
};
