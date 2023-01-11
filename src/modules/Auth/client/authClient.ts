import { AxiosResponse } from 'axios';

import { request } from '@cvt/clients/baseClient';
import { snakizeObject } from '@cvt/helpers/object';

import { mapUserData } from './authClient.formatter';

const authApiBaseUrl = process.env.REACT_APP_CVT_API_URL;

const signupWithEmailAndPassword = (data: Auth.SignupWithEmailAndPassword) => {
  return request({
    authenticate: false,
    options: {
      url: `${authApiBaseUrl}/signup/`,
      method: 'POST',
      data: snakizeObject<Auth.SignupWithEmailAndPasswordApi>(data),
    },
  });
};

const signupWithSSO = (invitationToken?: string) => {
  return request({
    options: {
      url: `${authApiBaseUrl}/signup-with-sso/`,
      method: 'POST',
      data: {
        user_invitation_id: invitationToken,
      },
    },
  });
};

const getMe = (): Promise<AxiosResponse<Users.User>> => {
  return request({
    options: {
      url: `${authApiBaseUrl}/users/me`,
      method: 'GET',
    },
  }).then((data: AxiosResponse<Users.UserApi>) => ({
    ...data,
    data: mapUserData(data.data),
  }));
};

export const authClient = {
  signupWithEmailAndPassword,
  signupWithSSO,
  getMe,
};
