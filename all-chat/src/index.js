const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const server = http.createServer(app)
const {Server} = require('socket.io')
const { addUser, getUsersInRoom, getUser, removeUser } = require('./utills/users')
const { generateMessage } = require('./utills/messages')
const io = new Server(server)
const publicDirectoryPath = path.join(__dirname, '../public')
const port = 4000

io.on('connection', (socket) => {
    console.log('socket', socket)

    socket.on('join', (options, callback) => {
        const {error, user} = addUser({id : socket.id, ...options})
        const roomData = {
            room : user.room,
            users : getUsersInRoom(user.room)
        }

        if(error) return callback(error)

        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', `${user.room} 방에 오신 걸 환영합니다`))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username}가 방에 참여했습니다`))

        io.to(user.room).emit('roomData', roomData)
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        const roomData = {
            room : user.room,
            users : getUsersInRoom(user.room)
        }

        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username}기 빙을 나갔습니다`))
            io.to(user.room).emit('roomData', roomData)
        }
    })
})

app.use(express.static(publicDirectoryPath))

server.listen(port, () => {
    console.log('backend is ready!')
})