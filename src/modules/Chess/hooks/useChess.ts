import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chessClient } from '../client/chessClient';
import { cacheKeys } from '../config';
import {AxiosHeaders} from "axios";
import React from "react";
import {FeedbackContext} from "@cvt/contexts";

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

interface CustomError {
    response: {
        headers: AxiosHeaders,
        data: {
            detail?: string
        }
    };
}

export const useMakePlayerMove = () => {

    const queryClient = useQueryClient();
    const { triggerFeedback } = React.useContext(FeedbackContext);
    const { genericErrorFeedback } = React.useContext(FeedbackContext);

    const makePlayerMove = useMutation(chessClient.makePlayerMove, {
        mutationKey: [cacheKeys.makePlayerMove],
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

    return {
        makePlayerMove: makePlayerMove.mutateAsync,
    };
}
