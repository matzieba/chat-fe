import { useQuery } from '@tanstack/react-query';

import { cacheKeys } from '../config';
import { userClient } from '../client/userClient';

export type Params = {
  id: string;
};

type Options = {
  enabled: boolean
};

const defaultOptions: Partial<Options> = {
  enabled: true,
};

export const useUser = (params: Params, options: Partial<Options> = defaultOptions) => {
  const { data: { data: user } = {}, status, error } = useQuery(
    [cacheKeys.getUser, params],
    () => userClient.getUser(params),
    {
      enabled: options.enabled,
    },
  );

  return {
    status,
    error,
    user,
  };
};
