const WebServer = require('./WebServer')

const MessageModel = require('./Models/Message')
const ConversationModel = require('./Models/Conversation')
const mongoose = require('mongoose')


mongoose.model( 'message', MessageModel )
mongoose.model( 'conversation', ConversationModel )

const mongoUrl = "mongodb://maxencemottard:vcL3NL5e7cdA3WbYvN7P@ds153380.mlab.com:53380/project-web-ynov"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true })
    .then( () => { console.log('Connected to database !') })
    .catch( (err) => { console.log(err) })

WebServer()
