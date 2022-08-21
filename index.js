const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
// });
io.on('connection',(socket)=>{
    console.log('socket is ready for connection');
    socket.on("sensor", (data) => {
        console.log(data)
        socket.broadcast.emit("sensor", data)
    })

    socket.on('joinRoom', ({ ...roomObject }) => {
        const user = userJoin(socket.id, roomObject.user.name, roomObject.room_uuid,roomObject.user.user_uuid);
        socket.join(user.room);
        socket.emit('message', 'Welcome to application'+user.username);
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
               `${user.username} has joined the call`
            );
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        io.to(user.room).emit('roomSettings', {
            ...roomObject
        });

    })
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});