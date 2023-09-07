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

require('dotenv').config()

// 정적 파일 저장
app.use(express.static(publicDirectory))
app.use(express.json())

mongoose.connect(process.env.mongoDB_URI)
.then(() => console.log('mongoDB connected!'))
.catch((error) => console.error(error))

io.on('connection', async(socket) => {
    let userData = {}
    users.push(userData)
    io.emit('users-data', {users})
    socket.on('message-to-server', () => {})
    socket.on('fetch-messages', () => {})
    socket.on('disconnected', () => {})
})

app.listen(port, () => {
    console.log('backend is ready!')
})