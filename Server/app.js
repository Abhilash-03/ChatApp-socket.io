import { Server } from "socket.io";
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

const chatServer = app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));

const io = new Server(chatServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5500', 'http://127.0.0.1:5500']
    }
})

io.on('connection', (socket) => {
    console.log('A connection has been established successfully!');
    socket.emit('message', `Welcome, ${(socket.id).substring(0,5)} in chatter talk`);
    socket.broadcast.emit('message', `User ${(socket.id).substring(0,5)} is entered in the chat!`)

    socket.on('message', (data) => {
      io.emit('message', data);
    })

    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name);    
    })

   socket.on('disconnect', () => console.log("A user has been disconnected from app!"))
})