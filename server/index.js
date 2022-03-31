const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const router = require('./router');
const {addUser, removeUser, getUser, getUserInRoom} = require('./user.js')

const app = express();
const server = http.createServer(app);
const io = socketio(server, {cors: {origin: "*"}});

app.use(cors());
app.use(router);
io.on('connect', (socket) => {
    console.log(`${socket.id} connected`);

    socket.on('join', ({name, room}, callback) => {
        const {error, user} = addUser({id: socket.id, name, room});

        //use callback for catch error
        if (error) {
            callback(error);
        }
        socket.emit('message', {user: 'admin', text: `Welcome ${user.name} has join room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined!`});
        socket.join(user.room);

        io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)})
        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user: user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});
        callback();
    });
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left!!!`})
        }
    });
});


server.listen(PORT, () => console.log(`Server started on port ${PORT}`));