import React from 'react';
import { Box, Container, Stack, Toolbar } from '@mui/material';

import { Authenticated } from '@modules/Auth/components';

import { Header } from '..//Header';
import { NavigationSidebar } from '../NavigationSidebar';

export const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [navigationOpen, setNavigationOpen] = React.useState(false);

  const openNavigation = () => {
    setNavigationOpen(true);
  };

  const closeNavigation = () => {
    setNavigationOpen(false);
  };

  const toggleNavigation = () => {
    setNavigationOpen(open => !open);
  };

  return (
    <React.Fragment>
      <Header onNavigationClickRequest={toggleNavigation} />
      <Stack direction="row">
        <Authenticated>
          <NavigationSidebar open={navigationOpen} onOpenRequest={openNavigation} onCloseRequest={closeNavigation} />
        </Authenticated>
        <Box component="main" width="100%">
          <Toolbar />
          <Container maxWidth={false}>
            <Box py={{ xs: 2, sm: 4 }} px={{ xs: 0, sm: 2 }}>
              {children}
            </Box>
          </Container>
        </Box>
      </Stack>
    </React.Fragment>
  );
};
