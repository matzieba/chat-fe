import React from "react";
import {MessageFeedbackView} from "@cvt/components/MessageFeedbackView";
import {BodyLoading} from "@cvt/components/layout/BodyLoading";
import {useThread} from "@modules/Chat/hooks/useThread";
import {useQueryClient} from "@tanstack/react-query";
import {useMessagesCrud} from "@modules/Chat/hooks/useMessagesCrud";
import { cacheKeys } from '@modules/Chat/config';
import {
    Box,
 Container,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
} from '@mui/material';
import { ChatBubble } from '@modules/Chat/components/ChatBubble';
import {Send} from "@mui/icons-material";
import {Navigate, useParams} from "react-router-dom";
import {routes} from "@shared/routes";

interface Props {
    id: number;
}

const ChatView: React.FC<Chats.Threads.ExtendedThread & Partial<Props>> = thread => {

    const queryClient = useQueryClient();

    const [refetchInterval, setRefetchInterval] = React.useState<number | undefined>();
    const { createMessage } = useMessagesCrud();
    const [message, setMessage] = React.useState<string>();
    const [isSending, setIsSending] = React.useState(false);
    const [isReceiving, setIsReceiving] = React.useState(false);

    const bottomEl = React.useRef<HTMLDivElement>(null);
    const messageContainerEl = React.useRef<HTMLDivElement>(null);

    const executeScroll = React.useCallback((behavior: ScrollBehavior = 'smooth') => {
        if (bottomEl.current != null) {
            return bottomEl.current.scrollIntoView({ behavior });
        }
        return;
    }, []);

    const lastMessage = React.useMemo(() => {
        if (thread) {
            const [lastMessage] = [...thread.messages].reverse();
            return lastMessage;
        }
    }, [thread]);

    const isLastMessageFromBot = React.useMemo(() => {
        if (lastMessage) {
            return lastMessage.role === 'assistant';
        }
        return false;
    }, [lastMessage]);


    React.useEffect(() => {
        if(!isLastMessageFromBot) {
            setIsReceiving(true);
            setIsSending(p => !p ? p : false);
            setMessage('');
        }
        if((isLastMessageFromBot && thread.isFinished) || thread.messages.length === 0) {
            setIsReceiving(false);
        }
    }, [isLastMessageFromBot, thread.messages.length, thread.isFinished]);

    //FIXME: This needs to be split and / or cleaned up
    const onSubmitAsync = React.useCallback(async (messageFromProps?: string) => {
        const msg = messageFromProps || message;
        try{
            setIsReceiving(true);
            setRefetchInterval(200);
            await createMessage({ message: `${msg}`, threadId: thread.id });
            setMessage('');
            setRefetchInterval(undefined);
            setIsReceiving(false);
        } catch(e) {
            setRefetchInterval(undefined);
            setIsReceiving(false);
            setIsSending(false);
        }
        setIsSending(false);
    }, [message, thread, createMessage]);

    const onSubmit = React.useCallback(async (e: any, messageFromProps?: string) => {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsSending(true);
        setIsReceiving(true);
        setTimeout(executeScroll, 200);
        onSubmitAsync(messageFromProps);
        queryClient.invalidateQueries([cacheKeys.getThread, thread.id]);
    }, [executeScroll, onSubmitAsync, queryClient, thread.id]);

    React.useEffect(() => {
        setTimeout(executeScroll, 100);
    }, [thread?.messages, executeScroll]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%">
            <Stack ref={messageContainerEl} direction="column" spacing={3} height="100%" maxHeight="100%" overflow="auto" py={3} px={{ xs: 2.5, sm: 1.5 }}>
                {thread.messages.map((message, idx) => !!message.messageText && (
                    <Box width="100%" display="flex" position="relative">
                        <ChatBubble
                            key={message.id}
                            id={message.id}
                            role={message.role}
                            message={message.messageText}
                            messageType={message.type}
                        />

                    </Box>
                ))}
                {(isSending && isLastMessageFromBot && !!message) && (
                    <ChatBubble
                        message={message}
                        role="user"
                    />
                )}
                {isReceiving && (
                    <Box display="flex" position="relative">
                        <ChatBubble
                            message="Loading..."
                            role="assistant"
                            isLoading
                        />
                    </Box>
                )}
                <div ref={bottomEl} />
            </Stack>

            <Paper component={Box} p={2} mt="auto" variant="elevation" elevation={2} square>
                <Stack direction="row" spacing={2}>
                    <Box component="form" onSubmit={onSubmit} width="100%">
                        <TextField
                            fullWidth
                            size="small"
                            autoComplete="off"
                            value={isSending ? '' : message}
                            onChange={e => setMessage(e.target.value)}
                            disabled={isSending || !!refetchInterval}
                            inputProps={{ maxLength: 500 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton color="primary" edge="end" disabled={isSending || !message || !!refetchInterval} onClick={onSubmit}>
                                            <Send/>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};

export const Chat: React.FC<Props> = ({ id }) => {
    const { status, thread } = useThread({ id } );

    if(!thread || status === 'loading') {
        return <BodyLoading />;
    }

    if(status === 'error') {
        return <MessageFeedbackView height="80vh"/>;
    }

    return <ChatView {...thread} />;
};

export const ViewChat = () => {
    // const { chatId } = useParams();
    const  chatId  = "1"


    if (!chatId) {
        return <Navigate to={routes.home} />;
    }

    return (
        <Container maxWidth={false} disableGutters sx={{ height: '100%' }}>
            <Box pt={8} pb="env(safe-area-inset-bottom)" height="100%">
                <Chat id={parseInt(chatId, 10)} />
            </Box>
        </Container>
    );
};