const socket = io('http://localhost:8000')

const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")
var audio = new Audio('assets/allmessage.mp3')

const append = (message, position1, position2) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageElement.classList.add('message')
    messageElement.classList.add(position1)
    messageElement.classList.add(position2)
    messageContainer.append(messageElement)
    if (position1 === 'left') {
        audio.play()
    }
}

const name = prompt("Enter Your Name To Join: ")
socket.emit('new-user-joined', name)

socket.on('user-joined', data => {
    append(`${data} joined the chat`, 'left', 'join')
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = messageInput.value
    append(`You: ${message}`, 'right')
    socket.emit('send', message)
    messageInput.value = ''
})

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

socket.on('left', data => {
    append(`${data} left the chat`, 'left', 'leave')
})