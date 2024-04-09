const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();

app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: '*'
});

const users = {};

io.on('connection', (socket) => {
  socket.on('user_connected', (userData) => {
    socket.emit('get_connected_users', users);
    socket.broadcast.emit('user_joined', userData);
    users[socket.id] = userData;
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user_left', users[socket.id]);
    delete users[socket.id];
  });
});

app.get('/', (req, res) => {
  res.send('hello');
});
httpServer.listen(5000, () => console.log('Listening at 5000...'));
