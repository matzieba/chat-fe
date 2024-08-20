import { AxiosResponse } from 'axios';

import { request } from '@cvt/clients/baseClient';

import { mapMessageData } from './messagesClient.formatter';

export class MessagingBlockedError extends Error {}

const chatApiBaseUrl = import.meta.env.VITE__CVT_API_URL;

const getMessage = (params: { id: number | string }): Promise<AxiosResponse<Chats.Messages.Message>> => {
  return request({
    options: {
      url: `${chatApiBaseUrl}/messages/${params.id}/`,
      method: 'GET',
    },
  }).then((data: AxiosResponse<Chats.Messages.MessageApi>) => ({
    ...data,
    data: mapMessageData(data.data),
  }));
};

const getMessages = (params: Chats.Messages.GetListParams): Promise<AxiosResponse<CVT.Query.PaginatedResults<Chats.Messages.Message>>> => {
  return request({
    options: {
      url: `${chatApiBaseUrl}/messages/`,
      method: 'GET',
      params,
    },
  }).then((data: AxiosResponse<CVT.Query.PaginatedResults<Chats.Messages.MessageApi>>) => ({
    ...data,
    data: {
      ...data.data,
      results: data.data.results.map(mapMessageData),
    },
  }));
};

const createMessage = (data: { threadId: number; message?: string }): Promise<AxiosResponse<Chats.Messages.Message>> => {
  return request({
    options: {
      url: `${chatApiBaseUrl}/conversations/${data.threadId}/messages/`,
      method: 'POST',
      data: {
        message: data.message,
      },
    },
  })
    .then((data: AxiosResponse<Chats.Messages.MessageApi>) => ({
      ...data,
      data: mapMessageData(data.data),
    }));
};


export const messagesClient = {
  getMessage,
  getMessages,
  createMessage,
};
