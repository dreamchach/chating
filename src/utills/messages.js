const messageModel = require("../models/messages.model")

const getToken = (sender, receiver) => {
    const key = [sender, receiver].sort().join('_')
    return key
}

const saveMessages = async({from, to, message, time}) => {
    const token = getToken(from, to)
    const data = {from, message, time}

    messageModel.updateOne({userToken : token}, {
        $push : {messages : data}
    }, (error, res) => {
        if(error) {
            console.error(error)
        }else {
            console.log('메시지가 생성되었습니다')
        }
    })
}

module.exports = {
    saveMessages
}