const socket = io()
const query = new URLSearchParams(location.search)
const username = query.get('username')
const room = query.get('room')
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const messages = document.querySelector('.messages')
const messageTemplate = document.querySelector('#message-template').innerHTML
const messageForm = document.querySelector('#message-form')
const messageFormInput = document.querySelector('input')
const messageFormButton = document.querySelector('button')
let sidebar = document.querySelector('.sidebar')

const scrollToBottom = () => {
    messages.scrollTop = messages.scrollHeight
    console.log(messages.scrollTop)
    console.log(messages.scrollHeight)
}

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})
socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {room, users})

    sidebar.innerHTML = html
})
socket.on('message', (message) => {
    const messageObject = {
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    }
    const html = Mustache.render(messageTemplate, messageObject)

    messages.insertAdjacentHTML('beforeend', html)
    scrollToBottom()
})

messageForm.addEventListener('submit', (event) => {
    event.preventDefault()
    
    const message = event.target.elements.message.value

    messageFormButton.setAttribute('disabled', 'disabled')
    
    socket.emit('sendMessage', message, (error) => {
        messageFormButton.removeAttribute('disabled')
        messageFormInput.value = ''
        messageFormInput.focus()

        if(error) {
            return console.log(error)
        }
    })
})