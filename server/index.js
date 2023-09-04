const http = require('http').createServer()
const io = require('socket.io')(http, {
    cors : {origin : '*'}
})
const port = 8080

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('message1', (message) => {
        io.emit('message2', `${socket.id} said ${message}`)
    })
})

http.listen(port, () => {
    console.log('8080 서버에서 실행 중')
})