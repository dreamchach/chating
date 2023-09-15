const messageModel = require("../models/messages.model")

const getToken = (sender, receiver) => {
    const key = [sender, receiver].sort().join('_')
    return key
}

const saveMessages = async({from, to, message, time}) => {
    const token = getToken(from, to)
    const data = {from, message, time}
    const updateMessage = await messageModel.findOneAndUpdate({userToken : token}, {$push: {messages : data}}, {new : true})
    console.log(updateMessage.messages)
}

const fetchMessages = async (io, sender, receiver) => {
    const token = getToken(sender, receiver)
    const foundToken = await messageModel.findOne({userToken : token})

    if(foundToken) {
        io.to(sender).emit('stored-messages', {messages : foundToken.messages})  
    } else {
        const data = {
            userToken : token,
            messages : []
        }
        const message = new messageModel(data)
        const saveMessage = message.save()

        if(saveMessage) console.log('메시지가 생성되었습니다')
        else console.log('메시지 생성 중 에러가 발생했습니다') 
    }
}

module.exports = {
    saveMessages,
    fetchMessages
}