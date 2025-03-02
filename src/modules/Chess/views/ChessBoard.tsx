import React from 'react';
import { Chessboard } from 'react-chessboard';
import { useGameCrud, useGetGame } from '@modules/Chess/hooks/useChess';
import { useParams, useNavigate } from 'react-router';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid
} from "@mui/material";
import { FeedbackContext } from "@cvt/contexts";
import { UserContext } from "@modules/Users/contexts";

export const ChessBoard: React.FC = () => {
    const { triggerFeedback } = React.useContext(FeedbackContext);
    const navigate = useNavigate();
    const initialGameId = useParams().gameId;
    const [gameId, setGameId] = React.useState(initialGameId);

    const [isPromotion, setIsPromotion] = React.useState(false);

    const [promotionMove, setPromotionMove] = React.useState<{
        from: string;
        to: string;
        piece: string;
    } | null>(null);

    const { user } = React.useContext(UserContext);

    const {
        chessGame: gameData,
        isLoading,
        error: initGameError,
        // @ts-ignore
    } = useGetGame({ game_id: gameId! });

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

    const onPromotionCheck = (
        sourceSquare: string,
        targetSquare: string,
        piece: string
    ) => {

        const isPromo = (
            (piece === 'wP' && targetSquare[1] === '8') ||
            (piece === 'bP' && targetSquare[1] === '1')
        );
        if (isPromo) {
            setIsPromotion(true);
            setPromotionMove({ from: sourceSquare, to: targetSquare, piece });
            return true;
        }
        return false;
    };

    const onPieceMove = (
        sourceSquare: string,
        targetSquare: string,
        piece: string
    ) => {

        if (isPromotion) {
            return false;
        }

        const isWhite = piece[0] === 'w';
        if (
            (isWhite && gameData.current_player.toLowerCase() !== 'white') ||
            (!isWhite && gameData.current_player.toLowerCase() !== 'black')
        ) {
            triggerFeedback({
                message: 'You are not allowed to make moves for AI',
                severity: 'error'
            });
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

    const onPromotionPieceSelect = (chosenPiece: string) => {
        if (!promotionMove || !chosenPiece) {
            return false;
        }

        const pieceLetter = chosenPiece.slice(-1).toLowerCase();

        const { from, to } = promotionMove;
        const finalMove = from + to + pieceLetter;

        updateGame({
            game_id: gameData.game_id,
            move: finalMove,
            player: gameData.current_player,
        })
            .then(() => {
                return updateGame({
                    game_id: gameData.game_id,
                    player: "black",
                });
            })
            .catch((err) => {
                console.error("Error updating game:", err);
            })
            .finally(() => {
                setIsPromotion(false);
                setPromotionMove(null);
            });

        return true;
    };

    const startNewGame = async () => {
        await deleteGame({ game_id: gameId });
        const newGame = await createGame({ human_player: user?.id });
        setGameId(newGame.game_id);
        navigate(`/chess/${newGame.game_id}`);
        setOpenPlayAgainDialog(false);
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
                    // @ts-ignore
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
                        The game ended as {gameData?.game_status}. Would you like to play again?
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