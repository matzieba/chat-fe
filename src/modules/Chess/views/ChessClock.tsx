import React from 'react';
import { Grid } from '@mui/material';

interface ChessClockProps {
    gameId: string | undefined;
    currentPlayer: 'white' | 'black';
    isGameOngoing: boolean;
    selectedTime: number;
    onTimeOut: (side: 'white' | 'black') => void;
    firstMoveMade: boolean;
}

export const ChessClock: React.FC<ChessClockProps> = ({
                                                          gameId,
                                                          currentPlayer,
                                                          isGameOngoing,
                                                          selectedTime,
                                                          onTimeOut,
                                                          firstMoveMade
                                                      }) => {
    const initialSeconds = selectedTime * 60;
    const [whiteTime, setWhiteTime] = React.useState<number>(initialSeconds);
    const [blackTime, setBlackTime] = React.useState<number>(initialSeconds);
    const [isClockRunning, setIsClockRunning] = React.useState<boolean>(true);
    React.useEffect(() => {
        setWhiteTime(initialSeconds);
        setBlackTime(initialSeconds);
        setIsClockRunning(true);
    }, [gameId, initialSeconds]);
    React.useEffect(() => {
        if (!isGameOngoing || !firstMoveMade || !isClockRunning) return;

        const timerId = setInterval(() => {
            setWhiteTime((prevWhite) => {
                if (currentPlayer === 'white' && prevWhite > 0) {
                    return prevWhite - 1;
                }
                return prevWhite;
            });
            setBlackTime((prevBlack) => {
                if (currentPlayer === 'black' && prevBlack > 0) {
                    return prevBlack - 1;
                }
                return prevBlack;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [isGameOngoing, firstMoveMade, isClockRunning, currentPlayer]);


    React.useEffect(() => {
        if (!isClockRunning || !isGameOngoing) return;
        if (firstMoveMade) {
            const timerId = setInterval(() => {
            }, 1000);

            return () => clearInterval(timerId);
        }
    }, [isClockRunning, isGameOngoing, firstMoveMade, currentPlayer]);

    React.useEffect(() => {
        if (!isClockRunning) return;

        if (whiteTime <= 0) {
            setWhiteTime(0);
            setIsClockRunning(false);
            onTimeOut("white");
        } else if (blackTime <= 0) {
            setBlackTime(0);
            setIsClockRunning(false);
            onTimeOut("black");
        }
    }, [whiteTime, blackTime, isClockRunning, onTimeOut]);
    const formatTime = (timeInSeconds: number) => {
        const m = Math.floor(timeInSeconds / 60);
        const s = timeInSeconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return (
        <Grid item xs={12} style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div>
                <strong>White Clock:</strong> {formatTime(whiteTime)}
                {'  |  '}
                <strong>Black Clock:</strong> {formatTime(blackTime)}
            </div>
        </Grid>
    );
};