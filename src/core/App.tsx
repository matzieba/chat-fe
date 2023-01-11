import React, { PropsWithChildren } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';

import { FeedbackProvider, LocalizationProvider, PermissionProvider } from '@cvt/contexts';
import { ThemeComponent } from '@cvt/theme/ThemeComponent';

import { SettingsConsumer, SettingsProvider } from '@shared/contexts';
import { Dictionary } from '@shared/dictionary';
import config from '@shared/config';
import { queryClientConfig } from '@shared/query';

import { DialogProvider } from './contexts/DialogContext/DialogContext';

type MainProps = PropsWithChildren<{
  themeSettings: CVT.Theme.Settings;
  dictionaries: Record<CVT.Language.SupportedLanguages, Dictionary>;
}>;

const queryClient = new QueryClient(queryClientConfig);

const Main: React.FC<MainProps> = ({ children,  dictionaries, themeSettings }) => (
  <Router>
    <MuiLocalizationProvider dateAdapter={AdapterDateFns}>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dictionaries={dictionaries}>
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
          // TODO: Figure out how to properly handle global namespace and modules
          // @ts-ignore
          dictionaries={config.language.dictionaries}
          themeSettings={themeSettings}
        >
          {children}
        </Main>
      )}
    </SettingsConsumer>
  </SettingsProvider>
);

