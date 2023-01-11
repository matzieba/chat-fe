import { useQuery } from '@tanstack/react-query';

import { cacheKeys } from '../config';
import { userClient } from '../client/userClient';

type Options = {
  enabled: boolean
};

const defaultOptions: Partial<Options> = {
  enabled: true,
};

export type Params = {
  id: string;
};

export const useInvitation = (params: Params, options: Partial<Options> = defaultOptions) => {
  const { data: { data: invite } = {}, status, error } = useQuery(
    [cacheKeys.getInvite, params],
    () => userClient.getInvite(params),
    {
      enabled: options.enabled,
    },
  );

  return {
    status,
    error,
    invite,
  };
};
