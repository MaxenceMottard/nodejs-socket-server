const mongoose = require('mongoose')

module.exports = class DatabaseManager {

    static async saveConversation (uuid) {
        const Conversation = mongoose.model('conversation')
        try {
            const newConversation = new Conversation({uuid, openAt: 2})

            await newConversation.validate()
            await newConversation.save()
        } catch (e) {
            console.log(e)
        }
    }

    static async saveMessage ({ conversationId, message, timestamp, isAdmin }) {
        timestamp = !timestamp ? Date.now() : timestamp
        isAdmin = !isAdmin ? false : isAdmin

        const Message = mongoose.model('message')
        try {
            const newMessage = new Message({conversationId, message, timestamp, isAdmin})

            await newMessage.validate()
            await newMessage.save()
        } catch (e) {
            console.log(e)
        }
    }

    static getConversations () {
        const Conversation = mongoose.model('conversation')

        return new Promise((resolve, reject) => {
            Conversation.find({}, (err, conversations) => {
                if (!err) {
                    resolve(conversations)
                } else {
                    reject(new Error(err))
                }
            })
        })
    }

    static getConversationMessages (conversationUuid) {
        const Message = mongoose.model('message')

        return new Promise(async (resolve, reject) => {
            try {
                const message = await Message.find({conversationId: conversationUuid}).sort([['timestamp', 1]])

                if (!message) {
                    resolve([])
                }

                resolve(message)
            } catch (e) {
                reject(e)
            }
        })
    }

    static getLastMessage (conversationUuid) {
        const Message = mongoose.model('message')

        return new Promise(async (resolve, reject) => {
            try {
                const message = await Message.findOne({conversationId: conversationUuid}).sort([['timestamp', -1]])

                if (!message) {
                    resolve({
                        conversationId: conversationUuid,
                        message: '',
                        timestamp: 0
                    })
                }

                resolve(message)
            } catch (e) {
                reject(e)
            }
        })
    }

    static getConversationsAndLastMessages () {
        return new Promise(async (resolve, reject) => {
            try {
                const conversations = await DatabaseManager.getConversations()

                let finalConversations = conversations.map(async (conversation) => DatabaseManager.getLastMessage(conversation.uuid)
                    .then((message) => {
                        return {
                            uuid: conversation.uuid,
                            openAt: conversation.openAt,
                            lastMessage: message
                        }
                    })
                    .catch(e => {
                       console.log(e)
                    })
                )

                Promise.all(finalConversations).then((convs) => {
                    resolve(convs)
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    static getConversationByConversationId (conversationId) {
        return new Promise( async (resolve, _) => {
            const Conversation = mongoose.model('conversation')

            try {
                const conversation = await Conversation.findOne({ uuid: conversationId }).exec()
                resolve(conversation)
            } catch (e) {
                console.log(e)
            }
        })
    }
}

