const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    RobloxId: {
        type: Number,
        required: true
    },
    Global: {
        type: Boolean,
        required: true
    },
    Ban: {
        type: Boolean,
        required: true
    },
    Reason: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model("BAN", schema)