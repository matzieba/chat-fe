import React from 'react';
import { Chessboard } from 'react-chessboard';
import { useMakePlayerMove, useGetGame } from '@modules/Chess/hooks/useChess';
import { useParams } from 'react-router';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from "@mui/material";
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

    const [openPlayAgainDialog, setOpenPlayAgainDialog] = React.useState(false);

    React.useEffect(() => {
        if (gameData?.game_status && gameData.game_status !== 'ongoing') {
            triggerFeedback({
                message: `Game ended as ${gameData.game_status}.`,
                severity: 'info',
            });
            setOpenPlayAgainDialog(true);
        }
    }, [gameData?.game_status, triggerFeedback]);

    if (initGameError) {
        return <div>There was an error...</div>;
    }

    if (!gameData) {
        return <div>Loading...</div>;
    }


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

    const startNewGame = () => {
        // Add your logic to reset the board or start a new game
        console.log('Starting a new game...');
        setOpenPlayAgainDialog(false);
        // This is where you would reset the game state or generate a new game ID
    };

    const handleCloseDialog = () => {
        setOpenPlayAgainDialog(false);
    };

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={8} style={{ textAlign: 'center' }}>
                <Chessboard id="BasicBoard" position={gameData?.board_state} onPieceDrop={onPieceMove} />
            </Grid>

            <Dialog
                open={openPlayAgainDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Game Over"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        The game has ended as {gameData?.game_status}. Would you like to play again?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">
                        No
                    </Button>
                    <Button onClick={startNewGame} color="inherit">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};