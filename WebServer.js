const app = require('express')()
const path = require('path')
const DatabaseManager = require('./DatabaseManager')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const cors = require('cors')
const fs = require('fs')
const dotenv = require('dotenv').config()

app.use(cors())

app.get('/administration', async (_, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'))
})

const manifestPath = path.resolve(__dirname, 'dist/manifest.json')
const manifest = fs.existsSync(manifestPath) ? require(manifestPath) : null

if (manifest) {
    app.get(manifest['main.js'], (_, res) => {
        res.sendFile(path.resolve(__dirname, `dist${manifest['main.js']}`))
    })
}

app.get('/conversations', async (_, res) => {
    try {
        const conversations = await DatabaseManager.getConversationsAndLastMessages()
        res.header('Content-Type', 'application/json').status(200).json(conversations)
    } catch (e) {
        console.log(e)
        res.send()
    }
})
app.get('/conversation/:conversationId/messages', async (req, res) => {
    try {
        const messages = await DatabaseManager.getConversationMessages(req.params.conversationId)
        res.json(messages)
    } catch (e) {
        res.json([])
    }
})

let adminArray = []
io.on('connection', (socket) => {

    socket.on('admin', _ => {
        socket.isAdmin = true
        adminArray.push(socket.id)
    })

    socket.on('admin-message', message => {
        DatabaseManager.saveMessage(message)
            .then(() => {
                io.to(message.conversationId).emit('admin-message', message)
            })

    })

    socket.on('client-message', async message => {
        const conversationId = message.conversationId
        const conversation = await DatabaseManager.getConversationByConversationId(conversationId)

        if (!conversation) {
            DatabaseManager.saveConversation(conversationId)
            DatabaseManager.saveMessage(message)
            adminArray.forEach(admin => {
                io.to(admin).emit('client-connection', {
                    openAt: Date.now(),
                    closeAt: null,
                    uuid: conversationId,
                    lastMessage: message
                })
            })
        } else {
            DatabaseManager.saveMessage(message)
                .then(() => {
                    adminArray.forEach(admin => {
                        io.to(admin).emit('client-message', message)
                    })
                })
        }

    })
})

module.exports = () => {
    const PORT = process.env.PORT || 8000

    http.listen(PORT, () => {
        console.log('Express & Socket.io servers are now starting')
    })
}
