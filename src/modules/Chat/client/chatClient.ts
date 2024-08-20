import { AxiosResponse } from 'axios';

import { request } from '@cvt/clients/baseClient';
import { snakizeObject } from '@cvt/helpers/object';

import { mapExtendedThreadData, mapThreadData } from './chatClient.formatter';


const chatApiBaseUrl = import.meta.env.VITE__CVT_API_URL;

const getThread = (params: { id: number | string }): Promise<AxiosResponse<Chats.Threads.ExtendedThread>> => {
  return request({
    options: {
      url: `${chatApiBaseUrl}/conversations/${params.id}/`,
      method: 'GET',
    },
  }).then((data: AxiosResponse<Chats.Threads.ExtendedThreadApi>) => ({
    ...data,
    data: mapExtendedThreadData(data.data),
  }));
};

const getThreads = (params: Chats.Threads.GetListParams): Promise<AxiosResponse<CVT.Query.PaginatedResults<Chats.Threads.Thread>>> => {
  return request({
    options: {
      url: `${chatApiBaseUrl}/conversations/`,
      method: 'GET',
      params,
    },
  }).then((data: AxiosResponse<CVT.Query.PaginatedResults<Chats.Threads.ThreadApi>>) => ({
    ...data,
    data: {
      ...data.data,
      results: data.data.results.map(mapThreadData),
    },
  }));
};

const createThread = (data: Chats.Threads.Create): Promise<AxiosResponse<Chats.Threads.Thread>> => {
  return request({
    options: {
      url: `${chatApiBaseUrl}/conversations/`,
      method: 'POST',
      data: snakizeObject(data),
    },
  }).then((data: AxiosResponse<Chats.Threads.ThreadApi>) => ({
    ...data,
    data: mapThreadData(data.data),
  }));
};

export const chatClient = {
  getThread,
  getThreads,
  createThread,
};
