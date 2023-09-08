const express = require('express')
const path = require('path')
const app = express()
const port = 4000
const publicDirectory = path.join(__dirname, '../public')
const http = require('http')
const {Server} = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)
let users = []
const mongoose = require('mongoose')
const crypto = require('crypto')
const { saveMessages, fetchMessages } = require('./utills/messages')
const randomId = () => crypto.randomBytes(8).toString('hex')

require('dotenv').config()

// 정적 파일 저장
app.use(express.static(publicDirectory))
app.use(express.json())

mongoose.connect(process.env.mongoDB_URI)
.then(() => console.log('mongoDB connected!'))
.catch((error) => console.error(error))

app.post('/session', (req, res) => {
    const data = {
        username : req.body.username,
        userID : randomId()
    }
    res.send(data)
})

io.use((socket, next) => {
    const username = socket.handshake.auth.username
    const userID = socket.handshake.auth.userID

    if(!username) {
        return next(new Error('Invalid username'))
    }

    socket.username = username
    socket.id = userID

    next()
})

io.on('connection', async(socket) => {
    let userData = {
        username: socket.username,
        userID : socket.id
    }
    users.push(userData)
    io.emit('users-data', {users})
    socket.on('message-to-server', (payload) => {
        io.to(payload.to).emit('message-to-client', payload)
        saveMessages(payload)
    })
    socket.on('disconnected', () => {
        users = users.filter((user) => user.userID !== socket.id)
        io.emit('users-data', {users})
        io.emit('user-away', socket.id)
    })
    socket.on('fetch-messages', ({receiver}) => {
        fetchMessages(io, socket.io, receiver)
    })
})

app.listen(port, () => {
    console.log('backend is ready!')
})