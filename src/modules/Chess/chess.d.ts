export namespace ChessApi {
    export interface GameApiResponse {
        game_id: number;
        board_state: string;
        moves: string[];
        game_status: string;
        created_at: string;
        current_player: string;
    }

    export interface PlayerMoveParams {
        game_id: number;
        move: string; // The move in 'e2e4' format
    }

}