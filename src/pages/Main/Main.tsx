import React from 'react';
import { Box, Container, Button } from "@mui/material";
import { routes } from "@shared/routes";
import { useNavigate } from "react-router";
import { AuthContext } from '@modules/Auth/contexts';
import { useGetGames } from "@modules/Chess/hooks/useChess";
import deer from '@shared/imgs/deer_1.png';

export const Main: React.FC = () => {
    const { user } = React.useContext(AuthContext);
    const navigate = useNavigate();

// Fetch the array of games (or stats) from your API
    const { statistics, isLoading, error } = useGetGames();

    const handleClick = () => {
        if (user) {
            navigate(routes.chess(user.gameId));
        }
    };

// If loading or error, handle that appropriately
    if (isLoading) return <div>Loading games...</div>;
    if (error) return <div>Unable to load games.</div>;

    return (
        <Container maxWidth={false} disableGutters sx={{ height: '100vh' }}>
            <Box
                pb="env(safe-area-inset-bottom)"
                height="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                <h1 style={{textAlign: 'center'}}>
                    Sidzina Chess Master Hall of Fame
                    <img
                        src={deer}
                        alt="logo"
                        style={{
                            verticalAlign: 'middle',
                            height: '1em',
                            filter: 'invert(100%) brightness(100%)',
                            marginLeft: '0.1em',
                            marginBottom: '0.2em'
                        }}
                    />
                </h1>

                {/* Display your table */}
                <Box component="table" border="1px solid #ccc">
                    <Box component="thead">
                        <Box component="tr">
                            <Box component="th" p="0.5rem 1rem">
                                First Name
                            </Box>
                            <Box component="th" p="0.5rem 1rem">
                            Last Name
                            </Box>
                            <Box component="th" p="0.5rem 1rem">
                                Wins
                            </Box>
                            <Box component="th" p="0.5rem 1rem">
                                Total Games
                            </Box>
                            <Box component="th" p="0.5rem 1rem">
                                Win Rate
                            </Box>
                        </Box>
                    </Box>
                    <Box component="tbody">
                        {statistics?.map((stat) => (
                            <Box component="tr" key={stat.id}>
                                <Box component="td" p="0.5rem 1rem">
                                    {stat.first_name}
                                </Box>
                                <Box component="td" p="0.5rem 1rem">
                                    {stat.last_name}
                                </Box>
                                <Box component="td" p="0.5rem 1rem">
                                    {stat.wins}
                                </Box>
                                <Box component="td" p="0.5rem 1rem">
                                    {stat.total_games}
                                </Box>
                                <Box component="td" p="0.5rem 1rem">
                                    {stat.win_rate}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Button onClick={handleClick} color="inherit" style={{ textAlign: 'center', margin: '2rem' }}>
                    Let's play some fkn Chess!
                </Button>
            </Box>
        </Container>
    );
};