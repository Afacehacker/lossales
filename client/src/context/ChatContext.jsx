import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import API from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const socket = useRef();
    const activeChatRef = useRef(null);
    const endpoint = import.meta.env.VITE_SOCKET_URL || 'https://lossales.onrender.com';


    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    useEffect(() => {
        if (user?._id) {
            socket.current = io(endpoint);
            socket.current.emit('addUser', { userId: user._id, isAdmin: user.isAdmin });

            socket.current.on('getMessage', (data) => {
                const currentActiveChat = activeChatRef.current;
                
                // If I am admin, only show message if it's from the user I'm currently chatting with
                // If I am a user, always show message (it's either from admin or bot)
                const shouldAppend = !user.isAdmin || (user.isAdmin && (data.senderId == currentActiveChat?.user?._id || data.isAdmin));

                if (shouldAppend) {
                    setMessages((prev) => [...prev, {
                        sender: data.isAdmin ? 'admin' : 'user',
                        message: data.message,
                        image: data.image,
                        createdAt: data.createdAt || new Date()
                    }]);
                }

                if (!user.isAdmin) {
                    setUnreadCount(prev => prev + 1);
                }
            });

            socket.current.on('getTyping', (data) => {
                setIsTyping(data.isTyping);
            });
        }

        return () => {
            if (socket.current) socket.current.disconnect();
        };
    }, [user?._id, user?.isAdmin, endpoint]);

    const fetchMyChat = useCallback(async () => {
        try {
            const { data } = await API.get('/chats/me');
            setMessages(data.messages);
            setActiveChat(data);
            setUnreadCount(data.unreadCountUser);
        } catch (error) {
            console.error('Error fetching chat:', error);
        }
    }, []);

    const sendMessage = useCallback(async (message, image, receiverId, senderType) => {
        try {
            const currentUserId = user?._id;
            const msgData = {
                message,
                image,
                userId: receiverId,
                senderType: senderType || (user?.isAdmin ? 'admin' : 'user')
            };

            await API.post('/chats/message', msgData);

            if (socket.current) {
                socket.current.emit('sendMessage', {
                    senderId: currentUserId,
                    receiverId: receiverId || 'admin',
                    message,
                    image,
                    isAdmin: user?.isAdmin,
                    senderType: senderType || (user?.isAdmin ? 'admin' : 'user')
                });
            }

            if (!user?.isAdmin || (user?.isAdmin && receiverId == activeChat?.user?._id)) {
                setMessages(prev => [...prev, {
                    sender: senderType || (user?.isAdmin ? 'admin' : 'user'),
                    message,
                    image,
                    createdAt: new Date()
                }]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [user?._id, user?.isAdmin, activeChat?.user?._id]);

    const markSeen = useCallback(async (userId) => {
        try {
            await API.put('/chats/seen', { userId });
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking as seen:', error);
        }
    }, []);

    return (
        <ChatContext.Provider value={{
            messages,
            setMessages,
            activeChat,
            setActiveChat,
            sendMessage,
            fetchMyChat,
            unreadCount,
            setUnreadCount,
            isTyping,
            socket: socket.current,
            markSeen
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
