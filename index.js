// This is the main file of our Node Server to handle requets of socket.io

const io = require('socket.io')(8000)
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.render('index.html'))
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

const users = {}

io.on('connection', socket => {
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
})