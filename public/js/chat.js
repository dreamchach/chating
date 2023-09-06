const socket = io()
const query = new URLSearchParams(location.search)
// '?username=John&room=Roomy
const username = query.get('username')
// 'John'
const room = query.get('room')
// 'Roomy'

console.log(socket)

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('joinMessage')

socket.on('roomData', ({room, users}) => {
    let html = `<h2>Welcome room ${room}</h2><ul>`
    html += users.map((user) => `<li>${user.username}</li>`)
    html += `</ul>`
    console.log(users)
    document.querySelector('#sidebar').innerHTML += html
})