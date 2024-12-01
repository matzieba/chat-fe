import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chessClient } from '../client/chessClient';
import { cacheKeys } from '../config';

export type Params = {
    game_id: number;
};

export const useGetGame = (params: Params) => {

    const { data: chessGame, status, error } = useQuery(

        [cacheKeys.getGame],
        () => chessClient.getGame(params),
    );
    return { chessGame, status, error };
};

export const useMakePlayerMove = () => {
    const queryClient = useQueryClient();
    const makePlayerMove = useMutation(chessClient.makePlayerMove, {
        mutationKey: [cacheKeys.makePlayerMove],
        onSuccess: async (data, payload) => {
            await queryClient.invalidateQueries([cacheKeys.getGame]);
        },
        onError: (e) => {
            throw e;
        },
    });

    return {
        makePlayerMove: makePlayerMove.mutateAsync,
    };
}
