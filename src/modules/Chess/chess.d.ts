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
        action?: string | undefined;
    }

    export interface PlayerStatistics {
        id?: string | undefined;
        first_name?: string | undefined;
        last_name?: string| undefined;
        win_rate?: string | undefined;
        total_games?: string | undefined;
        wins?: string | undefined;
    }

}