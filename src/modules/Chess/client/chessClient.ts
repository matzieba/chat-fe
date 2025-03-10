import { AxiosResponse } from 'axios';
import { request } from '@cvt/clients/baseClient';
import {ChessApi} from '../chess';

const chessApiBaseUrl = 'https://sidzinski.click/chess-api/v1/api'

const getGame = (params: { game_id: number | string }): Promise<ChessApi.GameApiResponse> => {

    return request({
        options: {
            url: `${chessApiBaseUrl}/chess_game/${params.game_id}`,
            method: 'GET',
        },
    }).then((response: AxiosResponse<ChessApi.GameApiResponse>) => response.data);
};

const updateGame = (params: ChessApi.PlayerMoveParams): Promise<ChessApi.GameApiResponse> => {
    return request({
        options: {
            url: `${chessApiBaseUrl}/chess_game/${params.game_id}/`,
            method: 'POST',
            data: params,
        },
    }).then((response: AxiosResponse<ChessApi.GameApiResponse>) => response.data);
};

const createGame = (params: ChessApi.GameCrud): Promise<ChessApi.GameApiResponse> => {
    return request({
        options: {
            url: `${chessApiBaseUrl}/chess_game/`,
            method: 'POST',
            data: params,
        },
    }).then((response: AxiosResponse<ChessApi.GameApiResponse>) => response.data);
};

const deleteGame = (params: ChessApi.GameCrud): Promise<ChessApi.GameApiResponse> => {
    return request({
        options: {
            url: `${chessApiBaseUrl}/chess_game/${params.game_id}/`,
            method: 'DELETE',
        },
    }).then((response: AxiosResponse<ChessApi.GameApiResponse>) => response.data);
};


export const chessClient = {
    getGame,
    updateGame: updateGame,
    createGame: createGame,
    deleteGame: deleteGame,
};