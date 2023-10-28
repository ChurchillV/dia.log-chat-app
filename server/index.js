require('dotenv').config();
const express = require('express');
const app = express();
http = require('http');
const cors = require('cors');
const leaveRoom = require('./utils/leaveRoom');
const harperSaveMessage = require('./services/harper-save-messages');
const harperGetMessages = require('./services/harper-get-messages');
const { Server } = require('socket.io');

app.use(cors()); // CORS middleware

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const CHAT_BOT = 'ChatBot';
let chatroom = '';
let allUsers = [];

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);
    
    // Add a user to a room
    socket.on('join_room', (data) => {
        const { username, room } = data;
        socket.join(room);
        let __createdtime__ = Date.now();
    
        // Alert all other users when someone joins the chat
        socket.to(room).emit('receive_message', {
            message : `${username} has joined the chat`,
            username : CHAT_BOT,
            __createdtime__,
        });

        // Welcome message on joining a chat room
        socket.emit('receive_message', {
            message : `Welcome ${username}`,
            username : CHAT_BOT,
            __createdtime__,
        });
        
        // Get all users in a chatroom
        chatroom = room;
        allUsers.push({ id : socket.id, username, room});
        let chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);

        // Get last 100 messages sent in the chat room
        harperGetMessages(room)
            .then((last100messages) => {
                socket.emit('last_100_messages', last100messages);
            })
            .catch((err) => console.log(err));
    });

    socket.on('send_message', (data) => {
        const { message, username, room, __createdtime__ } = data;
        io.in(room).emit('receive_message', data); // Send to all users in the room, including sender
        harperSaveMessage(message, username, room, __createdtime__)
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
    });

    socket.on('leave_room', (data) => {
        const { username, room } = data;
        socket.leave(room);
        const __createdtime__ = Date.now();

        // Remove user from memory
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(room).emit('chatroom_users', allUsers);
        socket.to(room).emit('receive_message', {
            username: CHAT_BOT,
            message: `${username} has left the chat`,
            __createdtime__,
        });
        console.log(`${username} has left the chat`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected from the chat');
        const user = allUsers.find((user) => user.id == socket.id);
        if(user?.username) {
            allUsers = leaveRoom(socket.id, allUsers);
            socket.to(chatroom).emit('chatroom_users', allUsers);
            socket.to(chatroom).emit('receive_message', {
                message : `${user.username} has disconnected from the chat.`,
            });
        }
    });
});

server.listen(4000, () => console.log('Server is running on port 4000'));