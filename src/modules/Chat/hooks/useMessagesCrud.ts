import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { FeedbackContext } from '@cvt/contexts';
import { cacheKeys } from '../config';
import { messagesClient, MessagingBlockedError } from '../client/messagesClient';

export const useMessagesCrud = () => {

  const { genericErrorFeedback } = React.useContext(FeedbackContext);
  const queryClient = useQueryClient();

  const createMessage = useMutation(messagesClient.createMessage, {
    mutationKey: [cacheKeys.createMessage],
    onSuccess: async (data, payload) => {
      await queryClient.invalidateQueries([cacheKeys.getThread, payload.threadId]);
      queryClient.invalidateQueries([cacheKeys.getThreads]);
    },
    onError: (e) => {
      if (e instanceof MessagingBlockedError) {
        throw e;
      } else {
        genericErrorFeedback();
        throw e;
      }
    },
  });

  return {
    createMessage: createMessage.mutateAsync,
  };
};
