const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    RobloxId: {
        type: Number,
        required: true
    },
    Level1: {
        type: Boolean,
        required: true
    },
    Level2: {
        type: Boolean,
        required: true
    }
})
module.exports = mongoose.model("AME", schema)