const mongoose = require('mongoose')

module.exports = mongoose.Schema({
    openAt: { type: 'number', required: true },
    closeAt: { type: 'number'},
    uuid: { type: 'string', required: true }
})
