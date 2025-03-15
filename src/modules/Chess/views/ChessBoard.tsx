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
import { Chess } from 'chess.js';

export const ChessBoard: React.FC = () => {
    const { triggerFeedback } = React.useContext(FeedbackContext);
    const navigate = useNavigate();
    const initialGameId = useParams().gameId;
    const [gameId, setGameId] = React.useState(initialGameId);

// Keep track of a local error string, if needed.
// That might be displayed in the UI or used for logs.
    const [moveError, setMoveError] = React.useState<string>("");

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

// Local chess.js instance + local board FEN
    const [localChess, setLocalChess] = React.useState<Chess>(() => new Chess());
    const [localFen, setLocalFen] = React.useState<string>(localChess.fen());

// Sync local chess.js state with server board state
    React.useEffect(() => {
        if (gameData?.board_state) {
            const newChess = new Chess();
            newChess.load(gameData.board_state);
            setLocalChess(newChess);
            setLocalFen(newChess.fen());
        }
    }, [gameData?.board_state]);

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

        // Ensure it's truly the player's turn
        const isWhiteMove = piece.startsWith('w');
        const currentPlayer = gameData.current_player.toLowerCase();
        if (
            (isWhiteMove && currentPlayer !== 'white') ||
            (!isWhiteMove && currentPlayer !== 'black')
        ) {
            triggerFeedback({
                message: 'You are not allowed to make moves for AI.',
                severity: 'error'
            });
            return false; // Snap the piece back
        }

        // Local validation with chess.js
        const attempt = localChess.move({ from: sourceSquare, to: targetSquare });

        if (attempt === null) {
            // Illegal move
            setMoveError("Illegal move");  // You could also show in your UI
            triggerFeedback({
                message: 'Illegal move!',
                severity: 'error'
            });
            // Force piece to snap back
            return false;
        }

        // Otherwise, the local move is legal. Show it on the board optimistically.
        setLocalFen(localChess.fen());

        // Clear any previous error
        setMoveError("");

        // Send the move to the server
        updateGame({
            game_id: gameData.game_id,
            move: sourceSquare + targetSquare,
            player: gameData.current_player,
        })
            .then(() => {
                // Possibly trigger the AI move or next player
                setTimeout(() => {
                    updateGame({
                        game_id: gameData.game_id,
                        player: 'black',
                    });
                }, 100);
            })
            .catch((err) => {
                console.error('Server rejected move:', err);
                triggerFeedback({
                    message: 'Server rejected move. Reverting...',
                    severity: 'error'
                });
                // Revert to server's board
                localChess.load(gameData.board_state);
                setLocalFen(localChess.fen());
            });

        return true;
    };

    const onPromotionPieceSelect = (chosenPiece: string) => {
        if (!promotionMove) return false;

        let pieceLetter: string;
        if (gameData.current_player.toLowerCase() === 'black') {
            pieceLetter = 'q';
        } else {
            if (!chosenPiece) return false;
            pieceLetter = chosenPiece.slice(-1).toLowerCase();
        }

        const { from, to } = promotionMove;
        const finalMove = from + to + pieceLetter;

        // Attempt local promotion move
        const attempt = localChess.move({
            from,
            to,
            promotion: pieceLetter
        });
        if (attempt === null) {
            triggerFeedback({
                message: 'Invalid promotion move!',
                severity: 'error'
            });
            localChess.load(gameData.board_state);
            setLocalFen(localChess.fen());
            setIsPromotion(false);
            setPromotionMove(null);
            return false;
        }

        setLocalFen(localChess.fen());

        updateGame({
            game_id: gameData.game_id,
            move: finalMove,
            player: gameData.current_player,
        })
            .then(() => {
                const nextPlayer =
                    gameData.current_player.toLowerCase() === 'white' ? 'black' : 'white';
                return updateGame({
                    game_id: gameData.game_id,
                    player: nextPlayer,
                });
            })
            .catch((err) => {
                console.error("Error updating game:", err);
                // Revert local changes
                localChess.load(gameData.board_state);
                setLocalFen(localChess.fen());
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
            <Grid item xs={12} sm={6} style={{ textAlign: 'center', width: '100%', maxWidth: '600px', margin: '0 auto'  }}>
                <Chessboard
                    id="BasicBoard"
                    position={localFen}
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