import { AxiosResponse } from 'axios';

import { request } from '@cvt/clients/baseClient';
import { camelizeObject, snakizeObject } from '@cvt/helpers/object';

import { mapUserCrudData, mapUserData } from './userClient.formatter';

const usersApiBaseUrl = import.meta.env.VITE__CVT_API_URL;

const getUser = (params: { id: number | string }): Promise<AxiosResponse<Users.User>> => {
  return request({
    options: {
      url: `${usersApiBaseUrl}/users/${params.id}/`,
      method: 'GET',
    },
  }).then((data: AxiosResponse<Users.UserApi>) => ({
    ...data,
    data: mapUserData(data.data),
  }));
};

const getUsers = (params: Users.GetListParams): Promise<AxiosResponse<CVT.Query.PaginatedResults<Users.User>>> => {
  return request({
    options: {
      url: `${usersApiBaseUrl}/users/`,
      method: 'GET',
      params: snakizeObject(params),
    },
  }).then((data: AxiosResponse<CVT.Query.PaginatedResults<Users.UserApi>>) => ({
    ...data,
    data: {
      ...data.data,
      results: data.data.results.map(mapUserData),
    },
  }));
};

const createUser = (data: Users.Create): Promise<AxiosResponse<Users.User>> => {
  return request({
    options: {
      url: `${usersApiBaseUrl}/users/`,
      method: 'POST',
      data: mapUserCrudData(data),
    },
  }).then((data: AxiosResponse<Users.UserApi>) => ({
    ...data,
    data: mapUserData(data.data),
  }));
};

const editUser = (data: Users.Edit): Promise<AxiosResponse<Users.User>> => {
  return request({
    options: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      url: `${usersApiBaseUrl}/users/${data.id}/`,
      method: 'PUT',
      data: mapUserCrudData(data),
    },
  }).then((data: AxiosResponse<Users.UserApi>) => ({
    ...data,
    data: mapUserData(data.data),
  }));
};

const deleteUser = (params: { id: number | string }): Promise<AxiosResponse> => {
  return request({
    options: {
      url: `${usersApiBaseUrl}/users/${params.id}/`,
      method: 'DELETE',
    },
  });
};

const inviteUser = (data: { email: string }): Promise<AxiosResponse> => {
  return request({
    options: { 
      url: `${usersApiBaseUrl}/user-invitations/`,
      method: 'POST',
      data,
    },
  }).then((data: AxiosResponse) => ({
    ...data,
    data: camelizeObject(data.data),
  }));
};

const getInvite = (params: { id: string }): Promise<AxiosResponse<Auth.UserInvite>> => {
  return request({
    options: {
      url: `${usersApiBaseUrl}/user-invitations/${params.id}/`,
      method: 'GET',
    },
    authenticate: false,
  }).then((data: AxiosResponse<Auth.UserInviteApi>) => ({
    ...data,
    data: camelizeObject(data.data),
  }));
};

export const userClient = {
  getUser,
  getUsers,
  createUser,
  editUser,
  deleteUser,
  inviteUser,
  getInvite,
};
