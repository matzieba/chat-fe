import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chessClient } from '../client/chessClient';
import { ChessApi } from '../chess';


type GetGameParams = {
    id: number;
};

export const useGetGame = (params: GetGameParams) => {
    const queryClient = useQueryClient();
    const { data: chessGame, status, error } = useQuery(
        ["getGame", params.id],
        () => chessClient.getGame(params),
        {
            onSuccess: (data) => {
                queryClient.setQueryData(['game', params.id], data);
            }
        }
    );
    return { chessGame, status, error };
};

export const useInitGame = () => {
    const queryClient = useQueryClient();
    const { mutate: initGame, data: chessGame, status, error } = useMutation(
        chessClient.initGame,
        {
            onSuccess: (data) => {
                queryClient.setQueryData(['game', data.game_id], data);
            }
        }
    );
    return { initGame, chessGame, status, error };
};

export const useMakePlayerMove = () => {
    const queryClient = useQueryClient();
    const { mutate: makePlayerMove, data: chessGame, status, error } = useMutation(
        chessClient.makePlayerMove,
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries(['game', variables.game_id]);
            }
        }
    );
    return { makePlayerMove, chessGame, status, error };
};


export const useMakeAiMove = () => {
    const queryClient = useQueryClient();
    const { mutate: makeAiMove, data: chessGame, status, error } = useMutation(
        chessClient.makeAiMove,
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries(['game', variables.game_id]);
            }
        }
    );
    return { makeAiMove, chessGame, status, error };
};