import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Avatar,
    Box,
    List,
    ListItem,
    ListItemText,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

import { AuthContext } from '@modules/Auth/contexts';
import { UserContext } from '@modules/Users/contexts';

import { DataGrid } from '@mui/x-data-grid';

interface Props extends Partial<Pick<Chats.Messages.Message, 'id' | 'createdAt'>> {
    message: string;
    role: Chats.Messages.MessageRole;
    isLoading?: boolean;
    messageType?: string;
}

export const ChatBubble: React.FC<Props> = ({ role, message, messageType, isLoading = false }) => {

    const { firebaseUser } = React.useContext(AuthContext);
    const { user } = React.useContext(UserContext);

    const isDataGridMessage = React.useMemo(() => {
        return messageType === 'json';
    }, [messageType]);

    const dataColumns = React.useMemo(() => {
        if (isDataGridMessage) {
            const dataString = message.replace('DATA_GRID:', '');
            const data = JSON.parse(dataString);
            data.forEach((item: any, index: number) => item.id = index);
            const columns = Object.keys(data[0]).map((key) => ({ field: key, headerName: key, width: 150 }));
            return { data, columns };
        }
        return { data: [], columns: [] };

    }, [isDataGridMessage, message]);

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
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, color: 'secondary.contrastText', ml: { xs: -1.5, sm: 0 } }} alt="Valory" />
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
                    {isDataGridMessage &&
                        <DataGrid
                            rows={dataColumns.data}
                            columns={dataColumns.columns}
                            checkboxSelection
                        />
                    }
                    {!isDataGridMessage && <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ children }) => <Typography variant="body1" display="block" lineHeight={1}>{children}</Typography>,
                            h1: ({ children }) => <Typography variant="h3" component="h1" fontWeight={600} lineHeight={1}>{children}</Typography>,
                            h2: ({ children }) => <Typography variant="h2" component="h1" fontWeight={600} lineHeight={1}>{children}</Typography>,
                            h3: ({ children }) => <Typography variant="h3" fontWeight={600} lineHeight={1}>{children}</Typography>,
                            h4: ({ children }) => <Typography variant="h4" fontWeight={600} lineHeight={1}>{children}</Typography>,
                            h5: ({ children }) => <Typography variant="h5" fontWeight={600} lineHeight={1}>{children}</Typography>,
                            ul: ({ children }) => <List disablePadding>{children}</List>,
                            li: ({ children }) => <ListItem disablePadding><ListItemText disableTypography>{children}</ListItemText></ListItem>,
                            table: ({ children }) => <TableContainer><Table>{children}</Table></TableContainer>,
                            thead: ({ children }) => <TableHead>{children}</TableHead>,
                            tbody: ({ children }) => <TableBody>{children}</TableBody>,
                            tr: ({ children }) => <TableRow>{children}</TableRow>,
                            td: ({ children }) => <TableCell>{children}</TableCell>,
                        }}
                    >
                        {message}
                    </Markdown>}
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
