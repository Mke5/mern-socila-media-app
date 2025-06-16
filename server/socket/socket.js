const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*', // fallback for development
        methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
});

// In-memory map to store online users: { userId: socketId }
const userSocketMap = {};

// Helper to get a recipient's socket ID
const getRecieverSocketId = (recipientId) => {
    return userSocketMap[recipientId];
};

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    const userId = socket.handshake.query.userId;

    // Track socket ID by user ID
    if (userId && userId !== 'undefined') {
        userSocketMap[userId] = socket.id;
        console.log('User ID registered:', userId);
    }

    // Notify all clients of the current online users
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);

        // Remove the disconnected user from the map
        Object.keys(userSocketMap).forEach((key) => {
            if (userSocketMap[key] === socket.id) {
                delete userSocketMap[key];
            }
        });

        // Emit updated list of online users
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

module.exports = {
    io,
    server,
    app,
    getRecieverSocketId
};