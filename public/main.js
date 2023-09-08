const chatBody = document.querySelector('.chat-body')
const userTitle = document.querySelector('#user-title')
const loginContainer = document.querySelector('.login-container')
const userTable = document.querySelector('.users')
const userTagline = document.querySelector('#users-tagline')
const title = document.querySelector('#active-user')
const messages = document.querySelector('.messages')
const messageDiv = document.querySelector('.message-form')
const loginForm = document.querySelector('.user-login')
const messageForm = document.querySelector('.messageForm')
const message = document.getElementById('message')
const socket = io('http://localhost:4000', {
    autoConnect : false
})
const sessUsername = localStorage.getItem('session-username')
const sessUserID = localStorage.getItem('session-userID')

socket.onAny((event, ...args) => {
    console.log(event, ...args)
})

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const username = document.getElementById('username')
    createSession(username.value.toLowerCase())
    username.value = ''
})

const createSession = async (username) => {
    const options = {
        method : 'Post',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({username})
    }
    await fetch('/session', options)
    .then((res) => res.json())
    .then((data) => {
        socketConnect(data.username, data.userID)
        localStorage.setItem('session-username', data.username)
        localStorage.setItem('session-userID', data.userID)
        loginContainer.classList.add('display-none')
        chatBody.classList.remove('display-none')
        userTitle.innerHTML = data.username
    })
    .catch((error) => console.error(error))
}

const socketConnect = async (username, userID) => {
    socket.auth = {username, userID}
    await socket.connect()
}

socket.on('users-data', ({users}) => {
    const index = users.findIndex((user) => user.userID === socket.id)
    let ul = `<table class='table'>`
    
    if(index > -1) {
        users.splice(index, 1)
    }
    
    for(const user of users) {
        ul += `
            <tr class='socket-users' onclick="setActiveUser('${user.username}', '${user.userID}')">
                <td>${user.username}
                    <span id='${user.userID}'>!</span>
                </td>
            </tr>
        `
    }

    ul += `</table>`

    if(users.length > 0) {
        userTagline.innerHTML = '접속 중인 유저'
    }else {
        userTagline.innerHTML = '접속 중인 유저 없음'
    }
})

if(sessUsername && sessUserID) {
    socketConnect(sessUsername, sessUserID)
    userTitle.innerHTML = sessUsername
}

const setActiveUser = (username, userID) => {
    title.innerHTML = username
    title.setAttribute('userID', userID)
    messages.innerHTML = ''
    socket.emit('fetch-messages', {receiver : userID})
}

const appendMessage = ({message, time}) => {
    let div = document.createElement('div')

    div.classList.add('message')
    div.innerHTML = `
        <span class='message-text'>${message}</span>
        <span class='message-time'>${time}</span>
    `
    messages.append(div)
    messages.scrollTo(0, messages.scrollHeight)
}

messageForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const to = title.getAttribute('userID')
    const time = new Date().toLocaleString('en-US', {
        hour : 'numeric',
        minute: 'numeric',
        hour12 : true
    })
    const payload = {
        from : socket.id,
        to,
        message: message.value,
        time
    }

    socket.emit('message-to-server', payload)
    appendMessage(payload)
    message.value = ''
    message.focus()
})

socket.on('message-to-client', ({from, message, time}) => {
    const receiver = title.getAttribute('userID')

    if(receiver === from) {
        appendMessage({message, time})
    } 
})

socket.on('user-away', (userID) => {
    const to = title.getAttribute('userID')

    if(to === userID) {
        title.innerHTML = ''
    }
})