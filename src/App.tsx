import React from 'react';

import { App as CVTApp } from '@cvt/App';

import { AuthProvider } from '@modules/Auth/contexts';
import { UserProvider } from '@modules/Users/contexts';
import { MainLayout } from '@shared/components/layouts/MainLayout';
import { Dialogs } from '@shared/components/Dialogs';

import { Root } from '@pages/Root';

const App = () => {
  return (
    <CVTApp>
      <AuthProvider>
        <UserProvider>
          <MainLayout>
            <Root />
            <Dialogs />
          </MainLayout>
        </UserProvider>
      </AuthProvider>
    </CVTApp>
  );
};

export default App;
