const express = require('express');
const socket = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socket(server);

let tasks = [];

app.use(express.static('public'));

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

io.on('connection', (socket) => {
  // console.log('Nowe połączenie:', socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    // console.log('Dodano zadanie:', task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (taskId) => {
    tasks = tasks.filter(task => task.id !== taskId);
    // console.log('Usunięto zadanie o id:', taskId);
    socket.broadcast.emit('removeTask', taskId);
  });

});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Serwer na porcie ${PORT}`);
});