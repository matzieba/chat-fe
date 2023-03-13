import React, { PropsWithChildren } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';

import { FeedbackProvider, LocalizationProvider, PermissionProvider } from '@cvt/contexts';
import { ThemeComponent } from '@cvt/theme/ThemeComponent';

import { SettingsConsumer, SettingsProvider } from '@shared/contexts';
import { queryClientConfig } from '@shared/query';

import { DialogProvider } from './contexts/DialogContext/DialogContext';

type MainProps = PropsWithChildren<{
  themeSettings: CVT.Theme.Settings;
}>;

const queryClient = new QueryClient(queryClientConfig);

const Main: React.FC<MainProps> = ({ children, themeSettings }) => (
  <Router>
    <MuiLocalizationProvider dateAdapter={AdapterDateFns}>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider>
          <PermissionProvider>
            <ThemeComponent settings={themeSettings}>
              <FeedbackProvider>
                <CssBaseline/>
                <DialogProvider>
                  {children}
                </DialogProvider>
              </FeedbackProvider>
            </ThemeComponent>
          </PermissionProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </MuiLocalizationProvider>
  </Router>
);

export const App: React.FC<PropsWithChildren> = ({ children }) => (
  <SettingsProvider>
    <SettingsConsumer>
      {themeSettings => (
        <Main
          themeSettings={themeSettings}
        >
          {children}
        </Main>
      )}
    </SettingsConsumer>
  </SettingsProvider>
);

