import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chessClient } from '../client/chessClient';
import { cacheKeys } from '../config';
import {AxiosHeaders} from "axios";
import React from "react";
import {FeedbackContext} from "@cvt/contexts";
import {ChessApi} from "@modules/Chess/chess";

export type Params = {
    game_id: number;
};

export const useGetGame = (params: Params) => {

    const { data: chessGame, status, error, isLoading } = useQuery(
        [cacheKeys.getGame, params],
        () => chessClient.getGame(params),
    );
    return { chessGame, status, error, isLoading };
};

export const useGetGames = () => {

    const { data: statistics, status, error, isLoading } = useQuery(
        [cacheKeys.getGames],
        () => chessClient.getGames(),
    );
    return { statistics, status, error, isLoading };
};

interface CustomError {
    response: {
        headers: AxiosHeaders,
        data: {
            detail?: string
        }
    };
}

export const useGameCrud = () => {

    const queryClient = useQueryClient();
    const { triggerFeedback } = React.useContext(FeedbackContext);
    const { genericErrorFeedback } = React.useContext(FeedbackContext);

    const createGame = useMutation((params: ChessApi.GameCrud) => chessClient.createGame(params), {
        mutationKey: [cacheKeys.createGame],
        onError: (error: CustomError) => {
            genericErrorFeedback();
            if (!!error.response.data.detail) {
                triggerFeedback({
                    severity: 'error',
                    message: error.response.data.detail,
                });
            }
        },
    });

    const updateGame = useMutation(chessClient.updateGame, {
        mutationKey: [cacheKeys.updateGame],
        onSuccess: async (data, payload) => {
            await queryClient.invalidateQueries([cacheKeys.getGame]);
        },
        onError: (error: CustomError) => {
            genericErrorFeedback();
            if (!!error.response.data.detail) {
                triggerFeedback({
                    severity: 'error',
                    message: error.response.data.detail,
                });
            }
        },
    });

    const deleteGame = useMutation((params: {game_id: string | undefined}) => chessClient.deleteGame(params), {
        mutationKey: [cacheKeys.deleteGame],
        onError: (error: CustomError) => {
            genericErrorFeedback();
            if (!!error.response.data.detail) {
                triggerFeedback({
                    severity: 'error',
                    message: error.response.data.detail,
                });
            }
        },
    });

    return {
        updateGame: updateGame.mutateAsync,
        createGame: createGame.mutateAsync,
        deleteGame: deleteGame.mutateAsync,
    };
}
