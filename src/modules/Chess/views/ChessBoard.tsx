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

import { Chess } from 'chess.js'

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

// 2) Create a local chess.js instance and a local board state
    const [localChess, setLocalChess] = React.useState<Chess>(() => new Chess());
    const [localFen, setLocalFen] = React.useState<string>(localChess.fen());

// 3) Whenever the server's board state changes, sync localChess
    React.useEffect(() => {
        if (gameData?.board_state) {
            // Load the server's FEN into localChess
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
        // If we’re in the midst of a promotion, skip:
        if (isPromotion) {
            return false;
        }

        // Check if it's truly your turn (not AI’s turn, etc.)
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
            return false;
        }

        // 4) Local move-validation with chess.js
        const moveObject = {
            from: sourceSquare,
            to: targetSquare,
            // Note: If it might be a promotion, normally pass promotion: 'q' or whatever user chooses
        };
        const attempt = localChess.move(moveObject);

        if (attempt === null) {
            // Invalid move according to chess.js
            triggerFeedback({
                message: 'Invalid move!',
                severity: 'error'
            });
            // Revert localChess to server’s FEN just to be safe:
            localChess.load(gameData.board_state);
            setLocalFen(localChess.fen());
            return false;
        }

        // 5) If valid, update the UI optimistically
        setLocalFen(localChess.fen());

        // 6) Send the move to the server
        //    If the server rejects it, revert the local state
        updateGame({
            game_id: gameData.game_id,
            move: sourceSquare + targetSquare,
            player: gameData.current_player,
        })
            .then(() => {
                // Example: Make the AI move if it’s the next to move
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
                // Revert local board to server’s state
                localChess.load(gameData.board_state);
                setLocalFen(localChess.fen());
            });

        return true;
    };

// 7) If we do have a promotion piece chosen, handle it similarly,
//    with localChess handling the actual "promotion" move and
//    then sending it optimistically to the server.

    const onPromotionPieceSelect = (chosenPiece: string) => {
        if (!promotionMove) return false;

        // If it's AI (black) promoting, always choose queen ('q'),
        // otherwise use the piece chosen by the player.
        let pieceLetter: string;
        if (gameData.current_player.toLowerCase() === 'black') {
            pieceLetter = 'q';
        } else {
            if (!chosenPiece) return false;
            pieceLetter = chosenPiece.slice(-1).toLowerCase();
        }

        const { from, to } = promotionMove;
        const finalMove = from + to + pieceLetter;

        // Attempt local move with chess.js
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

        // Optimistically update board
        setLocalFen(localChess.fen());

        // Send to server
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
            <Grid item xs={12} sm={6} style={{ textAlign: 'center' }}>
                <Chessboard
                    id="BasicBoard"
                    // 8) Set the board’s displayed position to localFen,
                    //    which is updated optimistically
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