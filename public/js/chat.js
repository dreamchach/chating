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

socket.on('roomData', ({room, users}) => {
    let html = `<h2>Welcome room ${room}</h2><ul>`
    html += users.map((user) => `<li>${user.username}</li>`)
    html += `</ul>`
    console.log(users)
    document.querySelector('#sidebar').innerHTML += html
})

socket.on('joinMessage', (message) => {
    console.log(message)
    scrollToButtom()
    const messageTemplate = `
    <div class='message'>
        <p>
            <span class='message__name'>${message.username}</span>
            <span class='message__meta'>${moment(message.createAt).format('h:mm a')}</span>
        </p>
        <p>${message.text}</p>
    </div>
    `
    document.querySelector('#messages').innerHTML += messageTemplate
})

const scrollToButtom = () => {
    console.dir(messages)
    messages.scrollTop = messages.scrollHeight
}
