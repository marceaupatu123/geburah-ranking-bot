const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    RobloxId: {
        type: Number,
        required: true
    },
    Points: {
        type: Number,
        required: true
    },
  DiscordId:{
        type: Number,
        required: false
    }
})
module.exports = mongoose.model("Points", schema)