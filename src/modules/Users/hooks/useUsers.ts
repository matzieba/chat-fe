import { useQuery } from '@tanstack/react-query';

import { cacheKeys } from '../config';
import { userClient } from '../client/userClient';

type Options = {
  enabled: boolean
};

const defaultOptions: Partial<Options> = {
  enabled: true,
};

export const useUsers = (params: Users.GetListParams = {}, options: Partial<Options> = defaultOptions) => {
  const { data: { data } = {}, status, error } = useQuery(
    [cacheKeys.getUsers, params],
    () => userClient.getUsers(params),
    {
      enabled: options.enabled,
    },
  );

  return {
    status,
    error,
    count: data?.count || 0,
    users: data?.results || [],
  };
};
