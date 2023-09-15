const express = require('express')
const path = require('path')
const app = express()
const crypto = require('crypto')
const http = require('http')
const {Server} = require('socket.io')
const mongoose = require('mongoose')

const server = http.createServer(app)
const io = new Server(server)

const publicDirectory = path.join(__dirname, '../public')
app.use(express.static(publicDirectory))
app.use(express.json())

const env = require('dotenv')
env.config()
mongoose.connect(process.env.mongoDB_URI)
    .then(() => console.log('mongoDB is ready'))
    .catch((error) => console.log(error))

const randomId = () => {
    return crypto.randomBytes(8).toString('hex')
}
app.post('/session', (req, res) => {
    const data = {
        username : req.body.username,
        userID : randomId()
    }

    return res.send(data)
})

io.use((socket, next) => {
    const username = socket.handshake.auth.username
    const userID = socket.handshake.auth.userID

    if(!username) return next(new Error('허용되지 않는 이름입니다'))

    socket.username = username
    socket.id = userID

    next()
})

let users = []
const { saveMessages, fetchMessages } = require('./utills/messages');
io.on('connection', async (socket) => {
    let userData = {
        username : socket.username,
        userID : socket.id
    }

    users.push(userData)

    io.emit('users-data', {users})
    
    socket.on('message-to-server', (payload) => {
        io.to(payload.to).emit('message-to-client', payload)
        saveMessages(payload)    
    })        
    socket.on('fetch-messages', ({receiver}) => {
        fetchMessages(io, socket.id, receiver)    
    })
    socket.on('disconnect', () => {
        users = users.filter((user) => user.userID !== socket.id)

        io.emit('users-data', {users})
        io.emit('user-away', socket.id)
    })  
})

const port = 4000
server.listen(port, () => console.log('backend is ready'))