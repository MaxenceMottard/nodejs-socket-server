
const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    message: { type: 'string', required: true },
    conversationId: { type: 'string', required: true },
    timestamp: { type: 'number', required: true },
    isAdmin: { type: 'boolean', required: true }
})
