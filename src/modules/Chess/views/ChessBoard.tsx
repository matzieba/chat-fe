import React from 'react';
import { Chessboard } from 'react-chessboard';
import { useGameCrud, useGetGame } from '@modules/Chess/hooks/useChess';
import { useParams, useNavigate } from 'react-router';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from "@mui/material";
import {FeedbackContext} from "@cvt/contexts";
import {UserContext} from "@modules/Users/contexts";
import {isPast} from "date-fns";


export const ChessBoard: React.FC = () => {
    const { triggerFeedback } = React.useContext(FeedbackContext);
    const navigate = useNavigate();
    const initialGameId = useParams().gameId;
    const [gameId, setGameId] = React.useState(initialGameId);
    const [isPromotion, setIsPromotion] = React.useState(false);
    const { user } = React.useContext(UserContext);


    const {
        chessGame: gameData,
        isLoading,
        error: initGameError,
        // @ts-ignore
    } = useGetGame({game_id: gameId});

    const { updateGame, createGame, deleteGame } = useGameCrud();

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

    // @ts-ignore
    const onPieceMove = (sourceSquare, targetSquare, piece) => {
        // Check for pawn promotion
        if (isPromotion) {
            setIsPromotion(false); // Reset for next move
            return false;
        }

        const isWhite = piece[0] === 'w';
        if ((isWhite && gameData.current_player.toLowerCase() !== 'white') || (!isWhite && gameData.current_player.toLowerCase() !== 'black')) {
            triggerFeedback({ message: 'You are not allowed to make moves for AI', severity: 'error' });
            return false;
        }

        updateGame({
            game_id: gameData.game_id,
            move: sourceSquare + targetSquare,
            player: gameData.current_player,
        }).then(() => {
            setTimeout(() => {
                updateGame({
                    game_id: gameData.game_id,
                    player: 'black',
                });
            }, 100);
        });
        return true;
    };

    // @ts-ignore
    const onPromotionCheck = (sourceSquare, targetSquare, piece) => {
        setIsPromotion((piece === "wP" && targetSquare[1] === "8") || (piece === "bP" && targetSquare[1] === "1"));
        return isPromotion;
    };

    // @ts-ignore
    const onPromotionPieceSelect = (chosenPiece, promoteFromSquare, promoteToSquare) => {
        if (!chosenPiece) return false;

        // Perform the update with the promotion piece's name
        updateGame({
            game_id: gameData.game_id,
            move: promoteFromSquare + promoteToSquare + "=" + chosenPiece,
            player: gameData.current_player,
        });
        return true;
    };

    const startNewGame = async () => {
        await deleteGame({ game_id: gameId });
        const newGame = await createGame({ human_player: user?.id });
        setGameId(newGame.game_id)
        navigate(`/chess/${newGame.game_id}`);
        setOpenPlayAgainDialog(false);
    };

    const restartCurrentGame = async () => {
        await deleteGame({ game_id: gameId });
        const restartedGame = await createGame({ human_player: user?.id });
        setGameId(restartedGame.game_id);
        navigate(`/chess/${restartedGame.game_id}`);
    };

    const handleCloseDialog = () => {
        setOpenPlayAgainDialog(false);
    };

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={6} style={{ textAlign: 'center' }}>
                <Chessboard
                    id="BasicBoard"
                    position={gameData?.board_state}
                    onPieceDrop={onPieceMove}
                    onPromotionCheck={onPromotionCheck}
                    onPromotionPieceSelect={onPromotionPieceSelect}
                />
            </Grid>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                <Button onClick={startNewGame} color="inherit">
                    Restart
                </Button>
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