export namespace ChessApi {
    export interface GameApiResponse {
        game_id: number;
        board_state: string;
        moves: string[];
        game_status: string;
        created_at: string;
        current_player: string;
        player: string;
    }

    export interface PlayerMoveParams {
        game_id?: number | undefined;
        move?: string;
        player?: string | undefined;
    }

}