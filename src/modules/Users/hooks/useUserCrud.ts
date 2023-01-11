import React from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import { FeedbackContext, LocalizationContext } from '@cvt/contexts';

import { routes } from '@shared/routes';

import { cacheKeys } from '../config';
import { userClient } from '../client/userClient';

export const useUserCrud = () => {

  const navigate = useNavigate();
  const { dictionary } = React.useContext(LocalizationContext);
  const { triggerFeedback, genericErrorFeedback } = React.useContext(FeedbackContext);
  const queryClient = useQueryClient();

  const createUser = useMutation(userClient.createUser, {
    mutationKey: [cacheKeys.createUser],
    onSuccess: (data) => {
      queryClient.invalidateQueries([cacheKeys.getUsers]);
      navigate(routes.user.edit(data.data.id));
      triggerFeedback({
        severity: 'success',
        message: dictionary.feedback.changesSaved,
      });
    },
    onError: () => {
      genericErrorFeedback();
    },
  });

  const editUser = useMutation(({ id, ...data }: Users.Edit) => userClient.editUser({ id, ...data }), {
    mutationKey: [cacheKeys.editUser],
    onSuccess: (data) => {
      queryClient.invalidateQueries([cacheKeys.getUsers]);
      queryClient.invalidateQueries([cacheKeys.getUser, {
        id: data.data.id,
      }]);
      triggerFeedback({
        severity: 'success',
        message: dictionary.feedback.changesSaved,
      });
    },
    onError: () => {
      genericErrorFeedback();
    },
  });

  const deleteUser = useMutation((id: number) => userClient.deleteUser({ id }), {
    mutationKey: [cacheKeys.deleteUser],
    onSuccess: (data, id) => {
      // TODO: verify if id is correct
      queryClient.invalidateQueries([cacheKeys.getUsers]);
      queryClient.removeQueries([cacheKeys.getUser, {
        id,
      }]);
      triggerFeedback({
        severity: 'success',
        message: dictionary.feedback.changesSaved,
      });
    },
    onError: () => {
      genericErrorFeedback();
    },
  });

  const inviteUser = useMutation(userClient.inviteUser, {
    mutationKey: [cacheKeys.inviteUser],
    onSuccess: (result, request) => {
      triggerFeedback({
        severity: 'success',
        message: dictionary.users.invite.dialog.invitationSentInfo(request.email),
      });
    },
    onError: () => {
      genericErrorFeedback();
    },
  });

  return {
    createUser: createUser.mutateAsync,
    editUser: editUser.mutateAsync,
    deleteUser: deleteUser.mutateAsync,
    inviteUser: inviteUser.mutateAsync,
  };
};
