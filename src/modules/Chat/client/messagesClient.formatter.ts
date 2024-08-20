import { camelizeObject } from '@cvt/helpers/object';


export const mapMessageData = (data: Chats.Messages.MessageApi): Chats.Messages.Message => {
  const camelizedData = camelizeObject<Chats.Messages.Message>(data);

  return {
    ...camelizedData,
  };
};
