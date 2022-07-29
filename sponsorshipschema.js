const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    DiscordIdSponsoring: {
        type: Number,
        required: true
    },
    DiscordIdSponsored: {
        type: Number,
        required: true
    },
    BecameAgent: {
        type: Boolean,
        required: true
    }
})
module.exports = mongoose.model("Sponsor", schema)