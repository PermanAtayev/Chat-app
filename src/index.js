const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require("./utils/messages");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");

const port = 3000 || process.env.PORT;
app.use(express.static('public'));

io.on('connection', (socket) => {
    // console.log('New Websocket connected');

    socket.on('sendMessage', async (message, callback) => {
        const filter = new Filter();
        const user = await getUser(socket.id);

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed');
        }

        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    })

    socket.on('disconnect', async () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage("Admin", user.username + " has left"));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            })    
        }

    });

    socket.on('sendLocation', async (position, callback) => {
        const user = await getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${position.latitude},${position.longtitude}`));
        callback();
    })

    socket.on('join', (options, callback) => {
        // let the user join specific room
        const { error, user } = addUser({ id: socket.id, ...options });
        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        // io.to.emit, socket.broadcast.to.emit
        socket.emit('message', generateMessage("Admin", "Welcome"));
        // will broadcast to the specific room
        socket.broadcast.to(user.room).emit('message', generateMessage("Admin", user.username + " has joined"));

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback();
    })
})

server.listen(port, () => {
    console.log("Listening at ", port);
})
