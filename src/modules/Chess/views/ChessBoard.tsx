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
    Grid,
    Select,
    MenuItem
} from "@mui/material";
import { FeedbackContext } from "@cvt/contexts";
import { UserContext } from "@modules/Users/contexts";
import { Chess } from 'chess.js';
import { ChessClock } from './ChessClock';
import { useQueryClient } from "@tanstack/react-query";
import { cacheKeys } from '../config';

export const ChessBoard: React.FC = () => {
    const queryClient = useQueryClient();
    const { triggerFeedback } = React.useContext(FeedbackContext);
    const navigate = useNavigate();
    const initialGameId = useParams().gameId;
    const [gameId, setGameId] = React.useState(initialGameId);

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

    const [localChess, setLocalChess] = React.useState<Chess>(() => new Chess());
    const [localFen, setLocalFen] = React.useState<string>(localChess.fen());

    const [firstMoveMade, setFirstMoveMade] = React.useState(false);

    const [selectedTime, setSelectedTime] = React.useState<number>(5); // default to 5 min
    const handleTimeControlChange = (event: any) => {
        setSelectedTime(event.target.value);
    };

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
        return <div>There was an error loading the game...</div>;
    }

    if (!gameData) {
        return <div>Loading...</div>;
    }

    const handleTimeOut = async (side: 'white' | 'black') => {
        triggerFeedback({
            message: `${side.toUpperCase()} ran out of time!`,
            severity: 'info',
        });

        try {
            await updateGame({
                game_id: gameData.game_id,
                player: side,
                action: 'timeout',
            });
        } catch (err) {
            console.error('Error updating game for timeout:', err);
        }

        setOpenPlayAgainDialog(true);
    };

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

        const isWhiteMove = piece.startsWith('w');
        const currentPlayer = gameData.current_player.toLowerCase();

        if (
            (isWhiteMove && currentPlayer !== 'white') ||
            (!isWhiteMove && currentPlayer !== 'black')
        ) {
            triggerFeedback({
                message: 'You are not allowed to move for the AI.',
                severity: 'error'
            });
            return false; // snap back
        }

        if (!firstMoveMade && isWhiteMove) {
            setFirstMoveMade(true);
        }

        localChess.move({ from: sourceSquare, to: targetSquare });
        setLocalFen(localChess.fen());
        setMoveError("");

        updateGame({
            game_id: gameData.game_id,
            move: sourceSquare + targetSquare,
            player: gameData.current_player
        })
            .then(() => {
                // Optionally trigger an AI move
                setTimeout(() => {
                    updateGame({
                        game_id: gameData.game_id,
                        player: 'black',
                    });
                    queryClient.invalidateQueries([cacheKeys.getGame, { game_id: gameData.game_id }]);
                }, 100);
            })
            .catch((err) => {
                console.error('Server rejected move:', err);
                triggerFeedback({
                    message: 'Server rejected move. Reverting to server state...',
                    severity: 'error'
                });
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
            player: gameData.current_player
        })
            .then(()=>{
            queryClient.invalidateQueries([cacheKeys.getGame, { game_id: gameData.game_id }]);
        })
            .catch((err) => {
                console.error('Error updating game:', err);
                // revert local state
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
        const newGame = await createGame({ human_player: user?.id });
        setGameId(newGame.game_id);

        setOpenPlayAgainDialog(false);
        setFirstMoveMade(false);

        navigate(`/chess/${newGame.game_id}`);
    };

    const handleCloseDialog = () => {
        setOpenPlayAgainDialog(false);
    };

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={12} style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <Select
                    value={selectedTime}
                    onChange={handleTimeControlChange}
                    style={{ marginRight: '1rem' }}
                >
                    <MenuItem value={5}>5 Minutes</MenuItem>
                    <MenuItem value={8}>8 Minutes</MenuItem>
                    <MenuItem value={10}>10 Minutes</MenuItem>
                </Select>
                <Button onClick={startNewGame} color="inherit">
                    New Game
                </Button>
            </Grid>

            <ChessClock
                gameId={gameId}
                currentPlayer={gameData.current_player.toLowerCase() as 'white' | 'black'}
                isGameOngoing={gameData.game_status === 'ongoing'}
                selectedTime={selectedTime}
                onTimeOut={handleTimeOut}
                firstMoveMade={firstMoveMade}
            />

            <Grid item xs={12} sm={6} style={{ textAlign: 'center', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                <Chessboard
                    id="BasicBoard"
                    position={localFen}
                    onPieceDrop={onPieceMove}
                    onPromotionCheck={onPromotionCheck}
                    // @ts-ignore
                    onPromotionPieceSelect={onPromotionPieceSelect}
                />
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
                        {gameData?.game_status && gameData.game_status !== 'ongoing'
                            ? `The game ended as ${gameData.game_status}.`
                            : 'A player ran out of time!'}
                        Would you like to play again?
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