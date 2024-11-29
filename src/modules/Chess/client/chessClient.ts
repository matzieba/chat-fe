import { AxiosResponse } from 'axios';
import { request } from '@cvt/clients/baseClient';
import {ChessApi} from '../chess';

const chessApiBaseUrl = 'http://localhost:8000/chess-api/v1/api'

const getGame = (params: { id: number | string }): Promise<ChessApi.GameApiResponse> => {
    return request({
        options: {
            url: `${chessApiBaseUrl}/chess_game/${params.id}/`,
            method: 'GET',
        },
    }).then((response: AxiosResponse<ChessApi.GameApiResponse>) => response.data);
};

const initGame = (): Promise<ChessApi.GameApiResponse> => {
    return request({
        options: {
            url: `${chessApiBaseUrl}/chess_game/`,
            method: 'POST',
        },
    }).then((response: AxiosResponse<ChessApi.GameApiResponse>) => response.data);
};

const makePlayerMove = (params: ChessApi.PlayerMoveParams): Promise<ChessApi.GameApiResponse> => {
    return request({
        options: {
            url: `${chessApiBaseUrl}/player_move/`,
            method: 'POST',
            data: params,
        },
    }).then((response: AxiosResponse<ChessApi.GameApiResponse>) => response.data);
};

const makeAiMove = (params: { game_id: number | string }): Promise<ChessApi.GameApiResponse> => {
    return request({
        options: {
            url: `${chessApiBaseUrl}/ai_move/`,
            method: 'POST',
            data: params,
        },
    }).then((response: AxiosResponse<ChessApi.GameApiResponse>) => response.data);
};

export const chessClient = {
    getGame,
    initGame,
    makePlayerMove,
    makeAiMove,
};