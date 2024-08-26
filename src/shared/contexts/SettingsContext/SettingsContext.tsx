import React from 'react';

import config from '@shared/config';

import { ContextProps } from './SettingsContext.types';

const localStorageKey = `${import.meta.env.VITE__CVT_PROJECT_KEY}-theme-mode`;

const defaultContext: ContextProps = {
  drawerWidth: config.theme.drawerWidth,
  mode: config.theme.defaultMode,
  setMode: () => null,
  toggleMode: () => null,
};



export const SettingsContext = React.createContext(defaultContext);

export const SettingsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

  const [mode, setMode] = React.useState<CVT.Theme.Settings['mode']>('dark');

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, mode);
  },[mode]);

  const toggleMode = React.useCallback(() => {
    setMode(mode => mode === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        drawerWidth: config.theme.drawerWidth,
        mode,
        setMode,
        toggleMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;
