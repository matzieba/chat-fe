import * as React from 'react';
import { AppBar, Avatar, Badge, Container, Hidden, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { Menu, Notifications } from '@mui/icons-material';

import { AuthContext } from '@modules/Auth/contexts';
import { Authenticated } from '@modules/Auth/components';

import config from '@shared/config';

import { UserMenu } from './UserMenu';

type Props = {
  onNavigationClickRequest: () => void;
};

export const Header: React.FC<Props> = ({ onNavigationClickRequest }) => {

  const { user } = React.useContext(AuthContext);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="fixed"
    >
      <Toolbar>
        <Hidden smUp>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onNavigationClickRequest}
          >
            <Menu />
          </IconButton>
        </Hidden>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {config.projectName}
        </Typography>

        <Stack flexGrow={0} direction="row" spacing={2}>
          {config.featureFlags.notifications && (
            <Authenticated>
              <IconButton
                size="large"
                color="inherit"
              >
                <Badge badgeContent={0} color="error">
                  <Notifications />
                </Badge>
              </IconButton> 
            </Authenticated>
          )}
          <UserMenu anchorEl={anchorElUser} onCloseRequest={handleCloseUserMenu}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={user?.displayName} src={user?.profilePicture || undefined} />
            </IconButton>
          </UserMenu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
