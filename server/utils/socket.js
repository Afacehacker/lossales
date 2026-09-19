const socketIO = require('socket.io');

const initSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: process.env.NODE_ENV === 'production' ? ['https://logssales.vercel.app', 'https://www.logssales.com'] : '*',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    let users = [];

    const addUser = (userId, socketId, isAdmin) => {
        !users.some((user) => user.userId === userId) &&
            users.push({ userId, socketId, isAdmin });
    };

    const removeUser = (socketId) => {
        users = users.filter((user) => user.socketId !== socketId);
    };

    const getUser = (userId) => {
        return users.find((user) => user.userId === userId);
    };

    io.on('connection', (socket) => {
        // When connected
        socket.on('addUser', ({ userId, isAdmin }) => {
            addUser(userId, socket.id, isAdmin);
            io.emit('getUsers', users);
        });

        // Send and receive message
        socket.on('sendMessage', ({ senderId, receiverId, message, image, isAdmin }) => {
            const user = getUser(receiverId);
            
            // If receiver is admin and sender is user
            if (!isAdmin) {
                // Broadcast to all connected admins
                const admins = users.filter(u => u.isAdmin);
                admins.forEach(admin => {
                    io.to(admin.socketId).emit('getMessage', {
                        senderId,
                        message,
                        image,
                        createdAt: new Date()
                    });
                });
            } else {
                // Admin sending to specific user
                if (user) {
                    io.to(user.socketId).emit('getMessage', {
                        senderId,
                        message,
                        image,
                        createdAt: new Date()
                    });
                }
            }
        });

        // Typing indicator
        socket.on('typing', ({ senderId, receiverId, isTyping, isAdmin }) => {
            if (!isAdmin) {
                const admins = users.filter(u => u.isAdmin);
                admins.forEach(admin => {
                    io.to(admin.socketId).emit('getTyping', { senderId, isTyping });
                });
            } else {
                const user = getUser(receiverId);
                if (user) {
                    io.to(user.socketId).emit('getTyping', { senderId, isTyping });
                }
            }
        });

        // When disconnect
        socket.on('disconnect', () => {
            removeUser(socket.id);
            io.emit('getUsers', users);
        });
    });

    return io;
};

module.exports = initSocket;
