import React from 'react';

import { App as CVTApp } from '@cvt/App';

import { AuthProvider } from '@modules/Auth/contexts';
import { UserProvider } from '@modules/Users/contexts';
import { CompanyProvider } from '@modules/Companies/contexts';

import { MainLayout } from '@shared/components/layouts/MainLayout';
import { Dialogs } from '@shared/components/Dialogs';

import { Root } from '@pages/Root';
import {FeedbackProvider} from "@cvt/contexts";

const App = () => {
  return (
    <CVTApp>
      <FeedbackProvider>
        <AuthProvider>
          <UserProvider>
            <CompanyProvider>
              <MainLayout>
                <Root />
                <Dialogs />
              </MainLayout>
            </CompanyProvider>
          </UserProvider>
        </AuthProvider>
      </FeedbackProvider>
    </CVTApp>
  );
};

export default App;
