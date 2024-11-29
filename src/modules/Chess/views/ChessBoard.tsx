import React from 'react';
import { Chessboard } from 'react-chessboard';
import { useInitGame, useMakePlayerMove, useMakeAiMove } from '@modules/Chess/hooks/useChess';

export const ChessBoard: React.FC = () => {
    const {
        initGame,
        chessGame: gameData,
        error: initGameError,
    } = useInitGame();

    const {
        makePlayerMove,
        chessGame: playerMoveGameData,
        error: playerMoveError,
    } = useMakePlayerMove();

    const {
        makeAiMove,
        chessGame: aiMoveGameData,
        error: aiMoveError,
    } = useMakeAiMove();

    const [gameState, setGameState] = React.useState(gameData);

    React.useEffect(() => {
        if (playerMoveGameData) {
            setGameState(playerMoveGameData);
        }
    }, [playerMoveGameData]);

    React.useEffect(() => {
        initGame();
    }, []);

    if (initGameError || playerMoveError || aiMoveError) {
        return <div>There was an error...</div>;
    }

    if (!gameData) {
        return <div>Loading...</div>;
    }

    const onPieceMove = (sourceSquare: string, targetSquare: string, piece: string) => {
        makePlayerMove({
            game_id: gameData.game_id,
            move: sourceSquare + targetSquare,
        });

        return true;
    };

    return (
        <Chessboard
            id="BasicBoard"
            position={gameState?.board_state}
            onPieceDrop={onPieceMove}
        />
    );
};