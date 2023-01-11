// ** External Imports
import axiosRequest, { AxiosResponse, AxiosRequestConfig } from 'axios';

import { firebaseClient } from './firebaseClient';

type RequestOptions =Omit<AxiosRequestConfig, 'url'> & {
  url: string;
};

export type AbstractRequest = (props: {
  options: RequestOptions;
  authenticate?: boolean;
  maxRetries?: number;
}) => Promise<AxiosResponse>;


export type FakeAbstractRequest = (props: {
  options: AxiosRequestConfig;
  authenticate?: boolean;
  maxRetries?: number;
  response: any;
}) => Promise<AxiosResponse>;

const attachOptions = async (options: RequestOptions, authenticate: boolean): Promise<RequestOptions> => {
  const token = await firebaseClient.getAuth().currentUser?.getIdToken();
  const selectedLanguage = typeof localStorage !== 'undefined' ? localStorage.getItem('mi-language') || 'en' : 'en';

  return {
    ...options,
    params: {
      ...options.params,
    },
    // @ts-ignore
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': selectedLanguage,
      ...(authenticate && {
        'Authorization': 'Bearer ' + token,
      }),
      ...options.headers,
    },
  };
};

export const request: AbstractRequest = async ({ options, authenticate = true, maxRetries = 3 }): Promise<AxiosResponse> => {
  const optionsWithHeader = await attachOptions({
    ...options,
  }, authenticate);

  return axiosRequest(optionsWithHeader).catch(e => {
    if (e.response && e.response.status && (e.response.status === 403 || e.response.status === 401) && maxRetries > 0) {
      if ([401].includes(e.response.status)) {
        firebaseClient.auth.signOut();
      }
    }
    throw e;
  });
};

export const fakeRequest: FakeAbstractRequest = async ({ response }): Promise<AxiosResponse> => {
  if (response.status === 200) {
    return Promise.resolve({
      status: response.status,
      data: response.data,
      statusText: 'success',
      headers: {},
      config: {},
    });
  } else {
    return Promise.reject({
      status: response.status,
      data: response.data,
      statusText: 'error',
      headers: {},
      config: {},
    });
  }
};
