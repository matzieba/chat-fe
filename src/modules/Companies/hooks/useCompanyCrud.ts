import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import { FeedbackContext, LocalizationContext } from '@cvt/contexts';

import { cacheKeys } from '../config';
import { companyClient } from '../client/companyClient';

export const useCompanyCrud = () => {

  const { dictionary } = React.useContext(LocalizationContext);
  const { triggerFeedback, genericErrorFeedback } = React.useContext(FeedbackContext);
  const queryClient = useQueryClient();

  const createCompany = useMutation((data: Companies.Create) => companyClient.createCompany(data), {
    mutationKey: [cacheKeys.editCompany],
    onSuccess: () => {
      queryClient.invalidateQueries([cacheKeys.getCompanies]);
      triggerFeedback({
        severity: 'success',
        message: dictionary.feedback.changesSaved,
      });
    },
    onError: () => {
      genericErrorFeedback();
    },
  });

  const editCompany = useMutation((data: Companies.Edit) => companyClient.editCompany(data), {
    mutationKey: [cacheKeys.editCompany],
    onSuccess: (data) => {
      queryClient.invalidateQueries([cacheKeys.getCompanies]);
      queryClient.invalidateQueries([cacheKeys.getCompany, {
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

  const deleteCompany = useMutation((id: number) => companyClient.deleteCompany({ id }), {
    mutationKey: [cacheKeys.deleteCompany],
    onSuccess: (data) => {
      queryClient.invalidateQueries([cacheKeys.getCompanies]);
      queryClient.removeQueries([cacheKeys.getCompany, {
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

  return {
    createCompany: createCompany.mutateAsync,
    editCompany: editCompany.mutateAsync,
    deleteCompany: deleteCompany.mutateAsync,
  };
};
