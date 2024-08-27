import React from 'react';
import remarkGfm from 'remark-gfm';
import {
    Avatar,
    Box,
    Stack,
} from '@mui/material';
import { AuthContext } from '@modules/Auth/contexts';
import { UserContext } from '@modules/Users/contexts';

interface Props extends Partial<Pick<Chats.Messages.Message, 'id' | 'createdAt'>> {
    message: string;
    role: Chats.Messages.MessageRole;
    isLoading?: boolean;
    messageType?: string;
}

export const ChatBubble: React.FC<Props> = ({ role, message, isLoading = false }) => {

    const { firebaseUser } = React.useContext(AuthContext);
    const { user } = React.useContext(UserContext);

    return (
        <Stack
            width="100%"
            direction="row"
            spacing={1}
            justifyContent={role === 'user' ? 'flex-end': 'flex-start'}
            sx={{
                'a:link, a:visited': {
                    textDecoration: 'underline',
                },
            }}
        >
            {(role === 'assistant' || isLoading) && (
                <Box>
                    <Avatar
                        sx={{
                            bgcolor: 'inverse.main',
                            width: 32,
                            height: 32,
                            color: 'secondary.contrastText',
                            ml: { xs: -1.5, sm: 0 }

                        }}
                        alt="Butler"
                        src={`https://storage.googleapis.com/sidzinski-butler/deer_1.png`}
                    />
                </Box>
            )}
            <Box
                sx={{
                    position: 'relative',
                    px: 2,
                    py: 1.5,
                    minWidth: isLoading ? undefined : 100,
                    maxWidth: role === 'assistant' ? '75vw' : '70vw',
                    borderWidth: 1,
                    borderStyle: isLoading ? 'dashed' : 'solid',
                    borderColor: t => t.palette.divider,
                    borderRadius: t => t.shape.borderRadius / 2,
                    background: t => role === 'user' ? t.palette.inverse.main : t.palette.background.paper,
                    color: t => role === 'user' ? t.palette.inverse.contrastText : t.palette.text.primary,
                }}
            >
                <Box sx={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1,
                    textAlign: isLoading ? 'center' : (role === 'user' ? 'right': 'left') }}
                >
                    {message}
                </Box>
            </Box>
            {role === 'user' && (
                <Box>
                    <Avatar sx={{ bgcolor: 'inverse.main', width: 32, height: 32, mr: { xs: -1.5, sm: 0 } }} alt={user?.firstName} src={user?.profilePicture || firebaseUser?.photoURL || undefined} />
                </Box>
            )}
        </Stack>
    );
};
