import * as React from 'react';
import { Box, Collapse, Divider, Drawer, IconButton, List,  ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText, SwipeableDrawer, Toolbar } from '@mui/material';

import { LocalizationContext, PermissionContext } from '@cvt/contexts';
import { NavLink } from '@cvt/components/NavLink';

import config from '@shared/config';
import { navigation } from '@shared/routes';

import { Authenticated, NotAuthenticated } from '@modules/Auth/components';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

type NavigationItemProps = {
  item: CVT.Navigation.NavigationItem;
  onCloseRequest: () => void;
  ListItemButtonProps?: Pick<ListItemButtonProps, 'sx'>;
}

type Props = React.PropsWithChildren<{
  open: boolean;
  onOpenRequest: () => void;
  onCloseRequest: () => void;
}>;

const NavigationItem: React.FC<NavigationItemProps> = ({ item, onCloseRequest, ListItemButtonProps }) => {
  const [open, setOpen] = React.useState(false);

  const { getPermission } = React.useContext(PermissionContext);

  const canView = React.useMemo(() => {
    return item.permission ? getPermission(item.permission) : true;
  }, [item, getPermission]);

  const allowedChildren = React.useMemo(() => {
    return item.children?.filter(it => it.permission ? getPermission(it.permission) : true);
  }, [item, getPermission]);

  const handleClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  const itemContent = (
    <React.Fragment>
      {item.icon && <ListItemIcon sx={{ marginLeft:1.5 }}>{item.icon}</ListItemIcon>}
      <ListItemText primary={item.text} secondary={item.secondaryText} />
      {allowedChildren && allowedChildren.length > 0 && (
        <IconButton onClick={handleClick} size="small">
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      )}
    </React.Fragment>
  );
  const itemChildren = (
    <React.Fragment>
      {allowedChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {allowedChildren.map((child, idx) => (
              <NavigationItem
                key={idx}
                item={child}
                onCloseRequest={onCloseRequest}
                ListItemButtonProps={{
                  sx: {
                    pl: child.icon ? 5 : 9,
                  },
                }}
              />
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );

  if (!canView) {
    return null;
  }
  if (item.divider) {
    return <Divider/>;
  }
  if (!!item.route) {
    return (
      <React.Fragment>
        <ListItemButton
          {...ListItemButtonProps}
          component={NavLink}
          to={item.route}
          onClick={onCloseRequest}
          disabled={item.disabled}
        >
          {itemContent}
        </ListItemButton>
        {itemChildren}
      </React.Fragment>
    );
  }
  if (!!item.onClick) {
    return (
      <React.Fragment>
        <ListItemButton
          {...ListItemButtonProps}
          disabled={item.disabled}
          onClick={() => [item.onClick && item.onClick(), onCloseRequest()]}
        >
          {itemContent}
        </ListItemButton>
        {itemChildren}
      </React.Fragment>
    );
  }
  return null;
};

export const NavigationSidebar: React.FC<Props> = ({ open, onOpenRequest, onCloseRequest }) => {

  const { dictionary } = React.useContext(LocalizationContext);

  const sidebarMenuRoutes = React.useMemo(() => {
    return navigation(dictionary).sidebar || [];
  }, [dictionary]);

  const authenticatedNavRoutes = React.useMemo(() => {
    return sidebarMenuRoutes.filter(it =>  it.requiresAuth || it.requiresAuth !== false);
  }, [sidebarMenuRoutes]);

  const notAuthenticatedNavRoutes = React.useMemo(() => {
    return sidebarMenuRoutes.filter(it => !it.requiresAuth);
  }, [sidebarMenuRoutes]);

  const drawer = (
    <React.Fragment>
      <Toolbar />
      <List>
        <Authenticated>
          {authenticatedNavRoutes.map((item, idx) => <NavigationItem key={idx} item={item} onCloseRequest={onCloseRequest} ListItemButtonProps={{ sx: { my: 1 } }} />)}
        </Authenticated>
        <NotAuthenticated>
          {notAuthenticatedNavRoutes.map((item, idx) => <NavigationItem key={idx} item={item} onCloseRequest={onCloseRequest} ListItemButtonProps={{ sx: { my: 1 } }} />)}
        </NotAuthenticated>
      </List>
    </React.Fragment>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: config.theme.drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <SwipeableDrawer
        container={container}
        variant="temporary"
        open={open}
        onOpen={onOpenRequest}
        onClose={onCloseRequest}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        PaperProps={{
          sx: {
            boxSizing: 'border-box',
            width: config.theme.drawerWidth,
          },
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
        }}
      >
        {drawer}
      </SwipeableDrawer>
      <Drawer
        variant="permanent"
        PaperProps={{
          sx: {
            boxSizing: 'border-box',
            width: config.theme.drawerWidth,
          },
        }}
        sx={{
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};
