import { useQuery } from '@tanstack/react-query';

import { companyClient } from '../client/companyClient';
import { cacheKeys } from '../config';

type Options = {
  enabled: boolean
};

const defaultOptions: Partial<Options> = {
  enabled: true,
};

export const useCompanies = (params: Companies.GetListParams = {}, options: Partial<Options> = defaultOptions) => {
  const { data: { data } = {}, status, error } = useQuery(
    [cacheKeys.getCompanies, params],
    () => companyClient.getCompanies(params),
    {
      enabled: options.enabled,
    },
  );

  return {
    status,
    error,
    count: data?.count,
    companies: data?.results || [],
  };
};
