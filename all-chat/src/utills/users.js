const users = []

const addUser = ({id, username, room}) => {
    const user = {id, username, room}
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    username = username.trim()
    room = room.trim()

    if(!username || !room) return {error : '사용자 이름과 방이 필요합니다'}
    if(existingUser) return {error : '사용자 이름이 사용 중입니다'}

    users.push(user)
    console.log({user}, user)

    return {user}
}

const getUsersInRoom = (room) => {
    room = room.trim()

    return users.filter((user) => user.room === room)
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) return users.splice(index, 1)[0]
}

module.exports = {
    addUser,
    getUsersInRoom,
    getUser,
    removeUser
}