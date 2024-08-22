
import React, { Fragment } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { trackPageview } from '@cvt/tracking';
import { useScrollTop } from '@cvt/hooks/useScrollTop';
import { BodyLoading } from '@cvt/components/layout/BodyLoading';

import { routes } from '@shared/routes';

import { AuthContext } from '@modules/Auth/contexts';
import { Authenticated, NotAuthenticated } from '@modules/Auth/components';


import { Login, SignUp, Impersonate, ResetPassword } from '@modules/Auth/views';
import { Invite } from '@modules/Users/views';
import {ViewChat} from "@modules/Chat/views/Chat/Chat";


export const Root = () => {

  useScrollTop();
  const { loading } = React.useContext(AuthContext);
  const location = useLocation();

  React.useEffect(() => {
    trackPageview();
  }, [location]);

  if(loading) {
    return <BodyLoading height="100vh"/>;
  }

  return (
    <React.Fragment>
      <NotAuthenticated>
        <Routes>
          <Route path={routes.auth.login} element={<Login/>}/>
          <Route path={routes.auth.resetPassword} element={<ResetPassword/>}/>
          <Route path={routes.auth.signup} element={<SignUp/>}/>
          <Route path={routes.auth.impersonateUser} element={<Impersonate/>}/>
          <Route path={routes.users.invite()} element={<Invite/>}/>
          <Route path="*" element={<Navigate to={routes.auth.login}/>}/>
        </Routes>
      </NotAuthenticated>
      <Authenticated>
        <Routes>
          <Route path={routes.home} element={<Fragment>Hello</Fragment>}/>
          <Route path={routes.chat()} element={<ViewChat/>}/>
          <Route path="*" element={<Navigate to={routes.home}/>}/>
        </Routes>
      </Authenticated>
    </React.Fragment>
  );
};
