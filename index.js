// This is the main file of our Node Server to handle requets of socket.io

const http = require('http');
const express = require('express');
const app = express();

const server = http.Server(app);

const users = {}

// The server should start listening
server.listen(3000);

// Pass a http.Server instance to the listen method
const io = require('socket.io')(server);

// Register the index route of your app that returns the HTML file
app.get('/', (req, res) => {
    console.log("Homepage");
    res.sendFile(__dirname + '/js/client.js');
});

// Expose the node_modules folder as static resources (to access socket.io.js in the browser)
app.use('/static', express.static('node_modules'));


// Handle connection
io.on('connection', socket => {
    console.log("Connected succesfully to the socket ...");

    socket.on('new-user-joined', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-joined', name)
    })

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    })

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id]
    })
});