import React from 'react';
import { Chessboard } from 'react-chessboard';
import { useMakePlayerMove, useGetGame } from '@modules/Chess/hooks/useChess';
import { useParams } from 'react-router';
import {Grid} from "@mui/material";


export const ChessBoard: React.FC = () => {
    const { gameId } = useParams();
    const {
        chessGame: gameData,
        error: initGameError,
        // @ts-ignore
    } = useGetGame({game_id: gameId});

    const { makePlayerMove } = useMakePlayerMove();


    if (initGameError) {
        return <div>There was an error...</div>;
    }

    if (!gameData) {
        return <div>Loading...</div>;
    }

    const onPieceMove = (sourceSquare: string, targetSquare: string, piece: string) => {
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
            style={{ minHeight: '100vh' }}
        >
            <Grid
                item
                xs={12}
                sm={4}
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