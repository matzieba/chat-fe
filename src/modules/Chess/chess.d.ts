export namespace ChessApi {
    export interface GameApiResponse {
        game_id?: string;
        board_state: string;
        moves: string[];
        game_status: string;
        created_at: string;
        current_player: string;
        player: string;
        human_player?: number;
    }

    export interface GameCrud extends Omit<GameApiResponse,
        'player' | 'current_player' | 'created_at' | 'updatedAt' | 'game_status' | 'moves' | 'board_state' >
     {
    }


    export interface PlayerMoveParams {
        game_id?: string | undefined;
        move?: string;
        player?: string | undefined;
    }

}