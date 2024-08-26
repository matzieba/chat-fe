import React from 'react';
import { Box, Container } from "@mui/material";
import { styled } from '@mui/system';
import { routes } from "@shared/routes";
import { useNavigate } from "react-router";
import { AuthContext } from '@modules/Auth/contexts';

const StyledImage = styled('img')({
    width: '60%',
    opacity: 0.7,
    borderRadius: '10%',
    transition: '0.3s',
    '&:hover': {
        transform: 'scale(0.95)'
    },
})

const ImageButton = styled('button')({
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer'
});

export const Main: React.FC = () => {

    const { user } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleClick = () => {
        if (user) {navigate(routes.chat(user.chatId))}
    }


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
                    Sidzina Chess World Open Series 2024
                    <img
                        src={`src/shared/imgs/deer_1.png`}
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
                <p style={{textAlign: 'center', margin: '2rem'}}>Yo! Yo! Jeżeli chcesz się znaleźć na miejscu Chlebiego,
                    klikaj!</p>
                <ImageButton onClick={handleClick}>
                    <StyledImage src="/src/shared/imgs/img.png" alt="description"/>
                </ImageButton>
            </Box>
        </Container>
    );
};