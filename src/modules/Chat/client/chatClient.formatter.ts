import { camelizeObject } from '@cvt/helpers/object';

export const mapThreadData = (data: Chats.Threads.ThreadApi): Chats.Threads.Thread => {
  const camelizedData = camelizeObject<Chats.Threads.Thread>(data);

  return camelizedData;
};

export const mapExtendedThreadData = (data: Chats.Threads.ExtendedThreadApi): Chats.Threads.ExtendedThread => {
  const camelizedData = camelizeObject<Chats.Threads.ExtendedThread>(data);

  return camelizedData;
};
