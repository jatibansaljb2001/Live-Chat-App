// This is the main file of our Node Server to handle requets of socket.io

const app = require('http').createServer(handler);
const io = require('socket.io')(app);
app.listen(80);

const users = {}

var handler = (req, res) => {
    console.log("Homepage");
    res.sendFile(__dirname + '/js/client.js');
}



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