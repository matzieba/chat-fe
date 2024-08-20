import { useQuery } from '@tanstack/react-query';

import { cacheKeys } from '@modules/Chat/config';
import { chatClient } from '@modules/Chat/client/chatClient';

export type Params = {
    id: number;
    isEmptyChat?: boolean,
};

type Options = {
    enabled: boolean
};

const defaultOptions: Partial<Options> = {
    enabled: true,
};

export const useThread = (
    params: Params,
    options: Partial<Options> = defaultOptions,

) => {

    const { data: { data: thread } = {}, status, error } = useQuery(
        [cacheKeys.getThread, params.id],
        () => chatClient.getThread(params),
        {
            enabled: options.enabled,
        },
    );

    return {
        status,
        error,
        thread,
    };
};
