import { useQuery } from '@tanstack/react-query';

import { companyClient } from '../client/companyClient';
import { cacheKeys } from '../config';

export type Params = {
  id: number | string;
};

type Options = {
  enabled: boolean
  retry: boolean
};

const defaultOptions: Partial<Options> = {
  enabled: true,
  retry: false,
};

export const useCompany = (params: Params, options: Partial<Options> = defaultOptions) => {
  const { data: { data: company } = {}, status, error } = useQuery(
    [cacheKeys.getCompany, params],
    () => companyClient.getCompany(params),
    {
      enabled: options.enabled,
      retry: options.retry,
    },
  );

  return {
    status,
    error,
    company,
  };
};
