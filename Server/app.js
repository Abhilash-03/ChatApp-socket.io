import { Server } from "socket.io";
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN = 'Bot';

app.get('/', (req, res) => res.send("Welcome to chatter talk"));

const chatServer = app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));

const io = new Server(chatServer, {
    cors: {
        origin: "https://chattertalk.vercel.app",
    }
})

io.on('connection', (socket) => {
    console.log('A connection has been established successfully!');
    socket.emit('message', buildMsg(ADMIN, `Welcome to the chatter talk.`));

    socket.on('enterChat', ({name}) => {
        socket.emit('message', buildMsg(ADMIN, `Hello ${name}, Say hi to strangers!!!`))
        socket.broadcast.emit('message', buildMsg(ADMIN, `${name} joined the chat!`));
    })    

    socket.on('message', ({name, text}) => {
      io.emit('message', buildMsg(name, text));

    })

    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name);    
    })

   socket.on('disconnect', () => console.log("A user has been disconnected from app!"))
})

function buildMsg(name, text) {
    return {
        name, 
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric'
        }).format(new Date())
    }
}