const express = require('express')
const app = express()
const path = require('path')
const publicDirectoryPath = path.join(__dirname, '../public')
const port = 4000
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const { addUser, getUsersInRoom } = require('./utils/users')
const { generateMessage } = require('./utils/messages')
const io = new Server(server)

io.on('connection', (socket) => {
    console.log('socket')
    console.log(socket.id)

    socket.on('join', (options, callback) => {
        console.log('join')
        const {error, user} = addUser({id:socket.id, ...options})
        
        if(error) {
            return callback(error)
        }
        
        socket.join(user.room)

        socket.emit('joinMessage', generateMessage('Admin', `${user.room} 방에 오신 걸 환영합니다`))
        socket.broadcast.to(user.room).emit('joinMessage', generateMessage('', `${user.username}가 방에 참여했습니다`))
    
        io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUsersInRoom(user.room)
        })
    })
    socket.on('sendMessage', () => {
        console.log('sendMessage')
    })
    socket.on('disconnect', () => {
        console.log('disconnect')
    })
})

app.use(express.static(publicDirectoryPath))

server.listen(port, () => {
    console.log('server is ready')
})