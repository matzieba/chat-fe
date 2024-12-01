import React from 'react';
import { Chessboard } from 'react-chessboard';
import { useMakePlayerMove, useGetGame } from '@modules/Chess/hooks/useChess';
import { useParams } from 'react-router';
import {Grid} from "@mui/material";
import {FeedbackContext} from "@cvt/contexts";


export const ChessBoard: React.FC = () => {
    const { triggerFeedback } = React.useContext(FeedbackContext);
    const { gameId } = useParams();
    const {
        chessGame: gameData,
        error: initGameError,
        // @ts-ignore
    } = useGetGame({game_id: gameId});

    const { makePlayerMove } = useMakePlayerMove();

    React.useEffect(() => {
        if (gameData?.game_status && gameData.game_status !== 'ongoing') {
            displayGameOverMessage(gameData.game_status);
        }
    }, [gameData?.game_status]);

    const displayGameOverMessage = (status: string) => {
        const message = status === 'checkmate' ? 'Checkmate! Game over.'
            : status === 'stalemate' ? 'Stalemate! It\'s a draw.'
                : status === 'draw' ? 'Draw! The game ended in a draw.'
                    : 'Game ended.';

        triggerFeedback({
            message,
            severity: 'info',
        });
    };

    if (initGameError) {
        return <div>There was an error...</div>;
    }

    if (!gameData) {
        return <div>Loading...</div>;
    }

    const onPieceMove = (sourceSquare: string, targetSquare: string, piece: string) => {

        const isWhite = piece[0] === 'w';

        if ((isWhite && gameData.current_player.toLowerCase() !== 'white') ||
            (!isWhite && gameData.current_player.toLowerCase() !== 'black')) {
            triggerFeedback({ message: 'You are not allowed to make moves for AI', severity: 'error' });
            return false;
        }
        makePlayerMove({
            game_id: gameData.game_id,
            move: sourceSquare + targetSquare,
            player: gameData.current_player,
        });
        setTimeout(() => {
            makePlayerMove({
                game_id: gameData.game_id,
                player: 'black' ,
            });
        }, 100);
        return true;
    };

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Grid
                item
                xs={12}
                sm={8}
                style={{ textAlign: 'center' }}
            >
                <Chessboard
                    id="BasicBoard"
                    position={gameData?.board_state}
                    onPieceDrop={onPieceMove}
                />
            </Grid>
        </Grid>
    );
};